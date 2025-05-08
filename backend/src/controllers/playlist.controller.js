import { db } from "../libs/db.js";

export const createPlayList = async (req, resp) => {
  try {

    const userId = req.user.id;
    const { name, description } = req.body;

    const playlist = await db.playlist.create({ 
        data: {
            name,
            description,
            userId
        }
    }) ;

    if (!playlist) {
      return resp.status(400).json({
        success: false,
        message: "Failed to create playlist",
      });
    }
    return resp.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });


  } catch (error) {
    console.error("Error creating playlist:", error);
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addProblemToPlaylist = async (req, resp) => {};

export const deletePlaylist = async (req, resp) => {};

export const removeProblemFromPlaylist = async (req, resp) => {};

export const getAllPlayListDetailsbyId = async (req, resp) => {};

export const getAllListDetails = async (req, resp) => {};
