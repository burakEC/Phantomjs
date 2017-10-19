var steps = [];

var testindex = 0;
var loadInProgress = false;
var loginTitle = "your login page title";
var homeTitle = "your home page title";
var webPage = require("webpage");

var page = webPage.create(), system = require("system"), t, address, username, password;

page.settings.userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36";
page.settings.javascriptEnabled = true;
page.settings.loadImages = true;
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

console.log("All settings loaded, start with execution");

if (1 === system.args.length) {
    console.log("Usage: hope_login.js <some URL> <username> <password>");
    phantom.exit();
}

address = system.args[1];
username = system.args[2];
password = system.args[3];

page.onConsoleMessage = function(a) {
    console.log(a);
};

steps = [ function() {
    console.log("Step 1 - Open login page");
    page.open(address, function(a) {
        var b = page.evaluate(function() {
            return document.title;
        });
        console.log("Login page title is -> " + b);
        if ("success" !== a) {
            console.log("Unable to access network!");
            phantom.exit();
        } else if (loginTitle !== b) {
            console.log("Wrong login page!");
            page.viewportSize = {
                width: 1280,
                height: 1024
            };
            page.clipRect = {
                top: 0,
                left: 0,
                width: 1280,
                height: 1024
            };
            page.render("error.png");
            phantom.exit();
        }
    });
}, function() {
    console.log("Step 2 - Populate and submit the login form");
	
    page.evaluate(function(username,password) {
        document.querySelector("input[id='username']").value = username;
        document.querySelector("input[id='password']").value = password;
        document.querySelector("#loginform").submit();
    },username,password);
	
}, function() {
    var c = page.evaluate(function() {
        return document.title;
    });
    console.log("Hope page title is -> " + c);
    if (homeTitle !== c) {
            console.log("Wrong home page!");
            page.viewportSize = {
                width: 1280,
                height: 1024
            };
            page.clipRect = {
                top: 0,
                left: 0,
                width: 1280,
                height: 1024
            };
            page.render("error.png");
            phantom.exit();
        }
    console.log("Step 3 - Wait foruser to login. After user is successfully logged in, user is redirected to home page. Save home page as png.");
    page.viewportSize = {
        width: 1280,
        height: 1024
    };
    page.clipRect = {
        top: 0,
        left: 0,
        width: 1280,
        height: 1024
    };
    page.render("login.png");
}, function() {
    console.log("Step 4 - Logout from system");
    page.evaluate(function() {
        document.querySelector("span.fa.fa-sign-out.logoutColorSupervisor-false").click();
    });
}, function() {
    console.log("Step 5 - After logout save page as png");
    page.viewportSize = {
        width: 1024,
        height: 768
    };
    page.clipRect = {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    };
    page.render("logout.png");
} ];

interval = setInterval(executeRequestsStepByStep, 50);

function executeRequestsStepByStep() {
    if (false == loadInProgress && "function" == typeof steps[testindex]) {
        steps[testindex]();
        testindex++;
    }
    if ("function" != typeof steps[testindex]) {
        console.log("Test complete!");
        phantom.exit();
    }
}

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("Loading started");
    t = Date.now();
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("Loading finished");
    t = Date.now() - t;
    console.log("Loading time " + t + " msec");
};

page.onConsoleMessage = function(a) {
    console.log(a);
};
