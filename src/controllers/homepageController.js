import homepageService from "../services/homepageService";
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomepage = (req, res) => {
    let fbPageId = process.env.PAGE_ID;
    return res.render("homepage.ejs", {
        fbPageId
    });
};

let getFacebookUserProfile = (req, res) => {
    return res.render("profile.ejs");
};

let setUpUserFacebookProfile = async (req, res) => {
    // Send the HTTP request to the Messenger Platform
    try {
        await homepageService.setUpMessengerPlatform(PAGE_ACCESS_TOKEN);
        return res.status(200).json({
            message: "OK"
        });
    } catch (e) {
        return res.status(500).json({
            "message": "Error from the node server"
        })
    }
};

let handleReserveTable = (req, res) => {
    return res.render('reserve-table.ejs')
}
let handlePostReserveTable = async (req, res) => {
    try {
        let customerName = "";  // đặt 1 biến rỗng
        if (req.body.customerName === "") {  // nếu kiểm tra khách hàng k điền tên( val = rỗng)
            customerName = "Để trống";           // thì biến customerName có giá trị là Để trống
        } else customerName = req.body.customerName;
        // đoạn này chỉ xử lý với tên khách hàng, còn email vào number ta lấy thẳng trong body 
        // I demo response with sample text
        // you can check database for customer order's status

        let response1 = {                                           // reponse gửi vào handleMessage
            "text": `---Thông tin khách hàng đặt bàn---
            \nHọ và tên: ${customerName}             
            \nĐịa chỉ email: ${req.body.email}
            \nSố điện thoại: ${req.body.phoneNumber}
            `
        };
        await chatbotService.sendMessage(req.body.psid, response1);
        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        console.log("lỗi post rerseve table: ", e)
        return res.status(200).json({
            message: "Sever error"
        });
    }
}
module.exports = {
    getHomepage: getHomepage,
    getFacebookUserProfile: getFacebookUserProfile,
    setUpUserFacebookProfile: setUpUserFacebookProfile,
    handleReserveTable: handleReserveTable,
    handlePostReserveTable: handlePostReserveTable
};

// Mục đích của export function là đẩy function đấy sang các file khác để dùng