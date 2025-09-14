const generateContent= require("../services/ai.service");

const getReview = async (req, res) => {
    try {
        const codePrompt = req.body.code;

        if (!codePrompt) {
            return res.status(400).json({
                message: "You need to enter correct prompt",
                data: "Please provide a question or prompt."
            });
        }

        console.log("Received prompt:", codePrompt);
        const responseData = await generateContent(codePrompt);
        
        res.status(200).json({
            message: "Successful",
            data: responseData,
        });
    } catch (error) {
        console.error("Error in controller:", error);
        res.status(500).json({
            message: "Internal server error",
            data: "Maaf karein, server mein koi problem hai. Baraye karam dobara koshish karein."
        });
    }
}

module.exports=getReview;