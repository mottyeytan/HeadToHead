import { Box, Button, InputBase } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface GuestSectionProps {
    onJoinRoom: (name: string) => void;
}

export const GuestSection = ({ onJoinRoom }: GuestSectionProps) => {
    const [guestName, setGuestName] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleJoinRoom = () => {
        if (guestName.trim()) {
            onJoinRoom(guestName);
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && guestName.trim()) {
            handleJoinRoom();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${isFocused ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
                boxShadow: isFocused
                    ? "0 0 0 4px rgba(16, 185, 129, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)"
                    : "0 4px 24px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <InputBase
                placeholder="השם שלך..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleEnter}
                sx={{
                    flex: 1,
                    py: 2,
                    px: 2.5,
                    fontSize: "1.05rem",
                    color: "#fafafa",
                    direction: "rtl",
                    "& input::placeholder": {
                        color: "rgba(250, 250, 250, 0.35)",
                        opacity: 1,
                    },
                }}
            />
            <Button
                variant="contained"
                onClick={handleJoinRoom}
                disabled={!guestName.trim()}
                endIcon={<ArrowBackIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{
                    px: 3,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 0,
                    background: guestName.trim()
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                    color: guestName.trim() ? "#fff" : "rgba(250, 250, 250, 0.3)",
                    textTransform: "none",
                    minWidth: "100px",
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        background: guestName.trim()
                            ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                            : "rgba(255, 255, 255, 0.05)",
                        boxShadow: guestName.trim() ? "0 0 20px rgba(16, 185, 129, 0.3)" : "none",
                    },
                    "&.Mui-disabled": {
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "rgba(250, 250, 250, 0.25)",
                    },
                }}
            >
                הצטרף
            </Button>
        </Box>
    );
};
