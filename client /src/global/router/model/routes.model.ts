const routes = {
    home: "/",
    gameLobby: "/:gameId",
    // חדר עם מזהה ייחודי - למארח
    gameRoom: "/:gameId/room/:roomId",
    // קישור הזמנה עם שם המזמין - לאורח
    gameRoomInvite: "/:gameId/room/:roomId/:inviterName",
    gamePlay: "/game/:gameId/play",
    login: "/login",
    register: "/register",
    profile: "/profile",
    settings: "/settings",
    logout: "/logout",
}

export default routes;