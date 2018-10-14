<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Chat | SZTEChat</title>
    
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway&amp;subset=latin-ext" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/emoji.css">
    <style>
        body {font-family: Raleway;}
        #react-loading {
            background-image: url(icon/loading.gif);
            background-repeat: no-repeat;
            background-position: center;
            position: absolute;
            top: 0px;
            left:0px;
            width: 100%;
            height: 100%;
        }

        #pleaseWait {padding: 10px;}
    </style>
</head>
<body>
    <div id="pleaseWait">Please wait, loading. Logged as <b><?=$_SESSION["email"]?></b></div>
    
    <div id="root"></div>
    <div id="react-loading"></div>
    <script src="./js/bundle.js"></script>
</body>
</html>