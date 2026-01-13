import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "../model/routes.model";
import { Home } from "../../../pages/Home";
import { GameLobby } from "../../../pages/GameLobbyPage";
import { RoomLobbyPage } from "../../../pages/RoomLobbyPage";
import { GamePlay } from "../../../features/game/components/GamePlay";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.gameLobby} element={<GameLobby />} />
                <Route path={routes.gameRoom} element={<RoomLobbyPage />} />
                <Route path={routes.gameRoomInvite} element={<RoomLobbyPage />} />
                <Route path={routes.gamePlay} element={<GamePlay />} />
            </Routes>
        </BrowserRouter>
    )
}