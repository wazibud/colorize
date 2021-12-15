var colorize = {
    logo: function () {
        window.open("index.html", "_self");
    },
    menu: '<menu area="left">'
        + '<option>Color</option>'
        + '<option>Enhance</option>'
        + '<option>Toonify</option>'
        + '</menu>'
    , getXMLDoc: function (xml) {
        return new DOMParser().parseFromString(xml, 'text/xml');
    },
    nodeMarkup: function (node) {
        //debugger;
        if (node.childNodes.length) {
            var list = '';
            for (var index = 0; index < node.childNodes.length; index++) {
                if (node.childNodes[index].tagName == 'option') {
                    list += '<li><a title="' + node.childNodes[index].textContent + ' images" href="account.html?option=' + node.childNodes[index].textContent.toLowerCase() + '"> ' + node.childNodes[index].textContent + '</li>';
                }
            }
            return list;
        }
    },
    hideConentContainer: function (hide) {
        hide ? document.getElementById('contentContainer').style.display = 'none' : document.getElementById('contentContainer').style.display = 'block';
        this.getQueryOption();
    },
    getQueryOption: function () {
        const params = new URLSearchParams(window.location.search);
        if (params && params.has('option')) {
            var queryOption = params.get('option');
            if (queryOption == 'color') {
                document.getElementById('queryOption').innerText = 'Color';
                return 'color'
            }
            else if (queryOption == 'enhance') {
                document.getElementById('queryOption').innerText = 'Enhance';
                return 'enhance'
            }
            else {
                document.getElementById('queryOption').innerText = 'Toonify';
                return 'toonify'
            }
        } else {
            document.getElementById('queryOption').innerText = 'Toonify';
            return 'toonify'
        }
    }
};

if (document.getElementById('treeView') != null) {
    document.getElementById('treeView').innerHTML = colorize.nodeMarkup(colorize.getXMLDoc(colorize.menu).documentElement);
}


const fileSelector = document.getElementById('fileInput');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    readImage(fileList[0]);
});

function readImage(file) {
    // Check if the file is an image.
    if (file.type && !file.type.startsWith('image/')) {
        console.log('File is not an image.', file.type, file);
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        document.getElementById("uploadImagePreview").src = event.target.result;
    });
    reader.readAsDataURL(file);
    convertImage();
}


deepai.setApiKey('4f968f66-303c-4a33-b113-b8e229e3eeaf');

async function convertImage() {
    var resp;

    switch (colorize.getQueryOption()) {
        case 'color':
            resp = await deepai.callStandardApi("colorizer", {
                image: document.getElementById('fileInput'),
            });
            break;
        case 'enhance':
            resp = await deepai.callStandardApi("torch-srgan", {
                image: document.getElementById('fileInput'),
            });
            break;
        default:
        case 'toonify':
            resp = await deepai.callStandardApi("toonify", {
                image: document.getElementById('fileInput'),
            });
            break;
    }
    document.getElementById("convertedImagePreview").src = resp.output_url;
}

var Menu_popup = document.getElementById("Menu_popup");

Menu_popup.style.maxHeight = "0px";

function toggle_a() {
    if (Menu_popup.style.maxHeight == "0px") {
        Menu_popup.style.maxHeight = "300px";
    }
    else {
        Menu_popup.style.maxHeight = "0px";
    }
}
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyC5YCqtRbypIV_503k9u1YRAxfSuYJWDgQ",
    authDomain: "image-colorize.firebaseapp.com",
    databaseURL: "https://image-colorize-default-rtdb.firebaseio.com",
    projectId: "image-colorize",
    storageBucket: "image-colorize.appspot.com",
    messagingSenderId: "93073138393",
    appId: "1:93073138393:web:0b9523090d91b78d9254c8",
    measurementId: "G-39VFVFVVD5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth();
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Other config options...
});


var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'account.html?option=' + colorize.getQueryOption(),
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: 'account.html',
    // Privacy policy url.
    privacyPolicyUrl: 'account.html'
};


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("user is signed in ");
        document.getElementById("firebaseui-user-container").hidden = false;
        document.getElementById("firebaseui-signout-container").hidden = false;
        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            document.getElementById("firebaseui-user-container").innerText = "Welcome to your account: " + name + " \n \n Account Email: " + email;
            colorize.hideConentContainer(false);
        }
    } else {
        // No user is signed in.
        console.log("user is not signed in ");
        // The start method will wait until the DOM is loaded.
        document.getElementById("firebaseui-auth-container").hidden = false;
        ui.start('#firebaseui-auth-container', uiConfig);
        colorize.hideConentContainer(true);
    }
});

var signout = function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("Sign out successful.");
        document.getElementById("firebaseui-user-container").hidden = true;
        document.getElementById("firebaseui-signout-container").hidden = true;
        colorize.hideConentContainer(true);

    }).catch(function (error) {
        // An error happened.
        console.log("Error Signing out.");
    });

}


