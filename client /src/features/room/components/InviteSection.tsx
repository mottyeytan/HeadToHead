import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useState } from "react";
import { useParams } from "react-router-dom";
import routes from "../../../global/router/model/routes.model";
import { games } from "../../questions/data/categories";


interface InviteSectionProps {
    roomId: string;
}


export const InviteSection = ({ roomId }: InviteSectionProps) => {
    
    const { gameId, inviterName } = useParams();
    const [copied, setCopied] = useState(false);
    const game = games[gameId as keyof typeof games] || null;
    const hostName = inviterName || localStorage.getItem("playerName") || "אורח";

    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
   
    // invite link includes the unique roomId and inviter name (encoded to URL)
    const inviteLink = `${baseUrl}${routes.gameRoomInvite
        .replace(":gameId", gameId || "")
        .replace(":roomId", roomId)
        .replace(":inviterName", encodeURIComponent(hostName))}`;

    // copy to clipboard function that works on mobile and desktop
    const copyToClipboard = (text: string) => {
        // try with modern API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            return;
        }
        
        // fallback to mobile - old method that works on HTTP
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
    };

    const handleCopyLink = () => {
        copyToClipboard(inviteLink);
    };

    const handleInviteFriends = async () => {
        const shareText = `${hostName} מזמין אותך למשחק ${game?.title}!\n\n${inviteLink}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    text: shareText,
                });
            } else {
                copyToClipboard(shareText);
            }
        } catch (error) {
            if ((error as Error).name !== "AbortError") {
                copyToClipboard(shareText);
            }
        }
    };

    
    return (
        <>  {/* Share buttons */}
        <Button
                        variant="contained"
                        onClick={handleInviteFriends}
                        endIcon={<IosShareIcon />}
                        sx={{
                            gap: "10px",
                            py: 2,
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            textTransform: "none",
                            "&:hover": {
                                transform: "scale(1.02)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        הזמן חברים
                    </Button>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(30, 60, 30, 0.8)",
                        border: "1px solid rgba(46, 204, 113, 0.3)",
                        borderRadius: "12px",
                        overflow: "hidden",
                    }}>
                        <Typography sx={{ 
                            flex: 1,
                            px: 2,
                            py: 1.5,
                            fontSize: "0.85rem",
                            color: "rgba(255,255,255,0.7)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            direction: "ltr",
                        }}>
                            {`${baseUrl.replace("https://", "").replace("http://", "")}/${gameId}/${roomId}`}
                        </Typography>
                        <Button
                            onClick={handleCopyLink}
                            endIcon={<ContentCopyIcon />}
                            sx={{
                                px: 1,
                                py: 1.5,
                                borderRadius: 0,
                                backgroundColor: "rgba(46, 204, 113, 0.2)",
                                color: "#2ecc71",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "rgba(46, 204, 113, 0.3)" },
                            }}
                        >
                        </Button>
                    </Box>

                    {copied && (
                        <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message="הקישור הועתק ללוח" anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                            <Alert severity="success">הקישור הועתק ללוח</Alert>
                        </Snackbar>
                    )}

        </>
    );
};