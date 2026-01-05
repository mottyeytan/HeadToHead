import { Box, Button, InputBase } from "@mui/material";
import { useState } from "react";
import LoginIcon from '@mui/icons-material/Login';

interface GuestSectionProps {
    onJoinRoom: (name: string) => void;
}

export const GuestSection = ({ onJoinRoom }: GuestSectionProps) => {
    const [guestName, setGuestName] = useState("");

    const handleJoinRoom = () => {
        if (guestName.trim()) {
            onJoinRoom(guestName);
        }
    };

    const handelEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleJoinRoom();
        }
    };

    return (
        <Box sx={{ 
            display: "flex", 
            flexDirection: "row",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            borderRadius: "50px",
            overflow: "hidden",
        }}>
            <InputBase
                placeholder="הכנס את שמך..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={handelEnter}
                sx={{
                    py: 2,
                    px: 3,
                    fontSize: "1.1rem",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    color: "#333",
                    flex: 1,
                    direction: "rtl",
                }}
            />
            <Button 
                variant="contained"
                onClick={handleJoinRoom}
                disabled={!guestName.trim()}
                endIcon={<LoginIcon />}
                sx={{
                    py: 2,
                    px: 3,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: 0,
                    background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                    textTransform: "none",
                    "&:disabled": {
                        background: "rgba(150,150,150,0.5)",
                        color: "rgba(255,255,255,0.5)",
                    },
                }}
            >
                הצטרף
            </Button>
        </Box>
    );
};