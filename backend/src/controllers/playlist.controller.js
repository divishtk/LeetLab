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

export const removeProblemFromPlaylist = async (req, resp) => {
    
};

export const getAllPlayListDetailsbyId = async (req, resp) => {
    const { playListid } = req.params;

    try {
        const playlist = await db.playlist.findMany({
            where: {
                id : playListid,
                userId: req.user.id
            },
            include: {
                problems : {
                    include: {
                        problem: true
                    }
                },
            }
        });
        if (!playlist) {
            return resp.status(400).json({
                success: false,
                message: "Playlist details not found",
            });
        }

        return resp.status(200).json({
            success: true,
            message: "Playlist details fetched successfully",
            playlist
        });
    } catch (error) {
        console.error("Error fetching playlist details:", error);
        return resp.status(500).json({
            success: false,
            message: "Internal server error while fetching playlist details",
        });
        
    }
};

export const getAllListDetails = async (req, resp) => {
    try {
        const getPlayListDetails = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems : {
                    include: {
                        problem: true
                    }
                },
            }
        });
        if (!getPlayListDetails) {
            return resp.status(400).json({
                success: false,
                message: "Failed to get playlist",
            });
        }
        return resp.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            getPlayListDetails
        });
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return resp.status(500).json({
            success: false,
            message: "Internal server error while fetching playlist problems",
        });
    }
};
