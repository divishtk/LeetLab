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

export const addProblemToPlaylist = async (req, resp) => {
    const { playListid } = req.params;
    const { problemIds } = req.body;
    
    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0) {
            return resp.status(400).json({
                success: false,
                message: "Invalid problem IDs",
            });
        }

        const problemsInPlayList = await db.problemsInPlayList.createMany({
            data: problemIds.map((problemId)=>({
                playListid,
                problemId ,
                
            }))
        })

        return resp.status(200).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlayList
        });
        
    } catch (error) {
        console.error("Error adding problems to playlist:", error);
        return resp.status(500).json({
            success: false,
            message: "Internal server error while adding problems to playlist",
        });
    }
    
};

export const deletePlaylist = async (req, resp) => {  
    const { playListid } = req.params;

    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playListid,
            }
        });

        if (!deletedPlaylist) {
            return resp.status(400).json({
                success: false,
                message: "Failed to delete playlist",
            });
        }

        return resp.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist
        });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        return resp.status(500).json({
            success: false,
            message: "Internal server error while deleting playlist",
        });
    }
 };

export const removeProblemFromPlaylist = async (req, resp) => {
    const { playListid } = req.params;
    const { problemIds } = req.body;
    
    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0) {
            return resp.status(400).json({
                success: false,
                message: "Invalid problem IDs",
            });
        }

        const deleteProblemsFromPlaylist = await db.problemsInPlayList.deleteMany({
            where :{
                playListid ,
                problemId :{
                    in:problemIds
                }
            }
        })

        resp.status(200).json({
            success: true,
            message: "Problems removed from playlist successfully",
            deleteProblemsFromPlaylist
        });
    }
    catch (error) {
        console.error("Error deleting problems from playlist:", error);
        return resp.status(500).json({
            success: false,
            message: "Internal server error while deleting problems from playlist",
        });
    }
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
