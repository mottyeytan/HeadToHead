import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "../model/routes.model";
import { Home } from "../../../pages/Home";
import { GameLobby } from "../../../pages/GameLobby";
import { GameRoom } from "../../../pages/GameRoom";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.gameLobby} element={<GameLobby />} />
                {/* חדר עם מזהה ייחודי */}
                <Route path={routes.gameRoom} element={<GameRoom />} />
                {/* קישור הזמנה - כשמישהו פותח קישור משותף */}
                <Route path={routes.gameRoomInvite} element={<GameRoom />} />
            </Routes>
        </BrowserRouter>
    )
}