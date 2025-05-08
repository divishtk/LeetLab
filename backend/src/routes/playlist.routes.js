import express from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares.js';
import { executeCode } from '../controllers/executeCode.controller.js';
import { addProblemToPlaylist, createPlayList, deletePlaylist, getAllListDetails, getAllPlayListDetailsbyId, removeProblemFromPlaylist } from '../controllers/playlist.controller.js';

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware , getAllListDetails)
playlistRoutes.get("/:playListid", authMiddleware , getAllPlayListDetailsbyId)
playlistRoutes.post("/create-playList", authMiddleware , createPlayList)
playlistRoutes.post('/:playListid/add-problem',authMiddleware, addProblemToPlaylist)
playlistRoutes.delete('/:playListid',authMiddleware, deletePlaylist)
playlistRoutes.delete('/:playListid/remove-problem', authMiddleware , removeProblemFromPlaylist)





export default playlistRoutes;