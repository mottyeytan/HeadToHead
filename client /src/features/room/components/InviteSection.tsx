import { Box, Typography, Button, Snackbar, Alert, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
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

    const inviteLink = `${baseUrl}${routes.gameRoomInvite
        .replace(":gameId", gameId || "")
        .replace(":roomId", roomId)
        .replace(":inviterName", encodeURIComponent(hostName))}`;

    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
        }

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
        setTimeout(() => setCopied(false), 2000);
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Share Button */}
            <Button
                variant="contained"
                onClick={handleInviteFriends}
                startIcon={<ShareIcon sx={{ fontSize: "1.1rem !important" }} />}
                sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.25)",
                    textTransform: "none",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 30px rgba(16, 185, 129, 0.35)",
                    },
                }}
            >
                הזמן חברים
            </Button>

            {/* Link Display */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    overflow: "hidden",
                }}
            >
                <Typography
                    sx={{
                        flex: 1,
                        px: 2,
                        py: 1.25,
                        fontSize: "0.8rem",
                        color: "rgba(250, 250, 250, 0.45)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        direction: "ltr",
                        fontFamily: "monospace",
                    }}
                >
                    {`${baseUrl.replace("https://", "").replace("http://", "")}/${gameId}/${roomId}`}
                </Typography>
                <IconButton
                    onClick={handleCopyLink}
                    sx={{
                        borderRadius: 0,
                        px: 1.5,
                        py: 1.25,
                        backgroundColor: copied ? "rgba(16, 185, 129, 0.1)" : "transparent",
                        color: copied ? "#10b981" : "rgba(250, 250, 250, 0.5)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            color: "#fafafa",
                        },
                    }}
                >
                    {copied ? (
                        <CheckIcon sx={{ fontSize: "1.1rem" }} />
                    ) : (
                        <ContentCopyIcon sx={{ fontSize: "1rem" }} />
                    )}
                </IconButton>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    sx={{
                        backgroundColor: "rgba(16, 185, 129, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "10px",
                        color: "#fff",
                        "& .MuiAlert-icon": {
                            color: "#fff",
                        },
                    }}
                >
                    הקישור הועתק
                </Alert>
            </Snackbar>
        </Box>
    );
};
