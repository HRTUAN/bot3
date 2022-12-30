(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

window.extAsyncInit = function () {
    // the Messenger Extensions JS SDK is done loading 

    MessengerExtensions.getContext('823910358819941',   //your app id
        function success(thread_context) {
            // success
            //set psid to input
            $("#psid").val(thread_context.psid);
            handleClickButtonReserveTable();
        },
        function error(err) {
            // error
            console.log('Lỗi đặt bàn', err);
        }
    );
};

//validate inputs
function validateInputFields() {
    const EMAIL_REG = /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $("#email");      // đặt 1 biến theo id email bên reserve-table.js  The #id Selector
    // jQuery id selector sử dụng thuộc tính id của thẻ HTML để tìm thấy những yếu tố cụ thể.
    // $('#id')
    // $('.class')
    let phoneNumber = $("#phoneNumber");  // tương tự, id phonenumber

    if (!email.val().match(EMAIL_REG)) {    // lấy giá trị trong biến và kiểm tra xem có khớp với biểu thức không
        email.addClass("is-invalid");       // nếu không khớp, tự động thêm 1 class vào id email có tên "is-invalid"
        return true;
    } else {
        email.removeClass("is-invalid");    // còn không remove class đó đi
    }

    if (phoneNumber.val() === "") {        // tương tự trên, nhưng chỉ kiểm tra xem nó có trống hay không chứ k kiểm tra khớp biểu thức
        phoneNumber.addClass("is-invalid");
        return true;
    } else {
        phoneNumber.removeClass("is-invalid");
    }

    return false;
}


function handleClickButtonReserveTable() {                        // nhiệm vụ của function này là xử lý khi khách ấn vào nút đặt bàn
    $("#btnReserveTable").on("click", function (e) {
        let check = validateInputFields(); //return true or false   

        let data = {                                  // cho tất cả dữ liệu người dùng nhập vào cho vào biến data
            psid: $("#psid").val(),
            customerName: $("#customerName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val()
        };

        if (!check) {
            //close webview
            MessengerExtensions.requestCloseBrowser(function success() {
                // webview closed
            }, function error(err) {
                // an error occurred
                console.log(err);
            });

            //send data to node.js server 
            $.ajax({
                url: `${window.location.origin}/reserve-table-ajax`,     // khi click vào đặt bàn, sẽ gọi đến sever node.js trên router reserve-table-ajax
                method: "POST",                                          // sau đó, router lại gọi đến file handlePostReserveTable trong homepagecontroller
                data: data,                                              // file handlePostReserveTable sẽ xử lý và gửi text( thông tin kh đã nhập) cho khách 
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    });
}
