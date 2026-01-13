const routes = {
    home: "/",
    gameLobby: "/:gameId",
    gameRoom: "/:gameId/room/:roomId",
    gameRoomInvite: "/:gameId/room/:roomId/:inviterName",
    gamePlay: "/game/:gameId/room/:roomId/play",
    login: "/login",
    register: "/register",
    profile: "/profile",
    settings: "/settings",
    logout: "/logout",
}

export default routes;