// Responsive menu
const body = document.querySelector("body");
const top_navbar = document.querySelector(".top_navbar");
const menuBtn = document.querySelector(".menu-btn");
const cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = () => {
    top_navbar.classList.add("show");
    menuBtn.classList.add("hide");
    body.classList.add("disabled");
}
cancelBtn.onclick = () => {
    body.classList.remove("disabled");
    top_navbar.classList.remove("show");
    menuBtn.classList.remove("hide");
}
window.onscroll = () => {
    this.scrollY > 20 ? top_navbar.classList.add("sticky") : top_navbar.classList.remove("sticky");
}

// Validate image extension and size
function validateSize(input) {
    const fileSize = input.files[0].size / 1024 / 1024; // in MiB
    const fileType = input.files[0].type.includes('image')
    if (fileSize > 2) {
        alert('File size exceeds 2 MiB');
        document.getElementById('image').value = "";
    } else if (!fileType) {
        alert('Only images are allowed')
        document.getElementById('image').value = "";
    } else {
        // Proceed further
    }
}

// // Example starter JavaScript for disabling form submissions if there are invalid fields
// (function() {
//     'use strict'

//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.querySelectorAll('.needs-validation')

//     // Loop over them and prevent submission
//     Array.prototype.slice.call(forms)
//         .forEach(function(form) {

//             form.addEventListener('submit', function(event) {
//                 if (!form.checkValidity()) {
//                     event.preventDefault()
//                     event.stopPropagation()
//                 }

//                 form.classList.add('was-validated')
//             }, false)

//         })
// })()