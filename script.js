
window.addEventListener("load",OnLoad);
window.addEventListener("resize",OnResize);
document.addEventListener('keydown', OnKeyPressed);
   

var KeyDirection;
var MovementTimer;
var Head;
var Step = 5;
var Direction;
var Target
var TargetStep = 5;
var Tail;
var Score;
var Highscore;
var bCrashed;
var StartGamePanel;
var BlinkBottomTextTimer;
var MoveSound = new Audio("Sounds/MoveSound.wav");
var EatSound = new Audio("Sounds/EatSound.wav");
var CrashSound = new Audio("Sounds/CrashSound.wav");



function OnLoad()
{
    bCrashed = true;
    Tail = document.getElementsByClassName("Tail");
    Head = document.createElement("div");
    Head.setAttribute("id","Head");
    document.getElementById("GamePanel").appendChild(Head);
    Target = document.createElement("div");
    Target.setAttribute("id","Target");
    document.getElementById("GamePanel").appendChild(Target);
    HUDPanel = document.getElementById("HUDPanel");
    OnResize();
    BlinkBottomTextTimer = setInterval(BlinkBottomText, 800);
}

function OnGameStart()
{
    Direction="down";
    MovementTimer = setInterval(Move, 200);
    Head.style.top = "0%";
    Head.style.left = "50%";
    Score = 0;
    document.getElementById("ScorePanel").innerHTML = "Score: " + Score;
    bCrashed = false;
    RespawnTarget();
    if(localStorage.getItem('Data') == null)
    {
        Highscore = 0;
    }
    else
    {
        Highscore = localStorage.getItem('Data');
    }
    document.getElementById("HighscorePanel").innerHTML = "Highscore: " + Highscore;
    HideHUD();
    var Size = Tail.length;
    for(var i=0; i<Size; i++)
    {
        Tail[0].parentNode. removeChild(Tail[0]);
    }
    Head.style.backgroundColor = "Yellow";
}

function OnResize()
{
    var PixelGap = 0.05;
    var GamePanel = document.getElementById("GamePanel");
    var InGamePanel = document.getElementById("InGamePanel");
    GamePanel.style.width = 100 + "vmin";
    GamePanel.style.height = 100 + PixelGap + "vmin";
    var SidePanelWidth = (window.innerWidth-GamePanel.offsetWidth)/2;
    if(SidePanelWidth < document.getElementById("ScorePanel").offsetWidth || SidePanelWidth < document.getElementById("HighscorePanel").offsetWidth)
    {
        if(window.innerWidth > window.innerHeight)
        {
            var InGamePanelHeight= PXToVH(InGamePanel.offsetHeight);
            GamePanel.style.width = 100- InGamePanelHeight + "vh";
            GamePanel.style.height = 100- InGamePanelHeight + "vh";
        }
        else if(window.innerWidth < window.innerHeight)
        {
            var  InGamePanelHeight = PXToVW(InGamePanel.offsetHeight);
            GamePanel.style.width = 100- InGamePanelHeight + "vw";
            GamePanel.style.height = 100- InGamePanelHeight + "vw";
            var Bottom = window.innerHeight - GamePanel.offsetHeight - InGamePanel.offsetHeight;
            InGamePanel.style.bottom = Bottom + "px";
        }
    }
    else
    {
    InGamePanel.style.bottom = "0px";
    }
}

function PXToVH(Px)
{
 return (100*Px)/document.getElementById("GamePanel").offsetHeight;
}

function PXToVW(Px)
{
 return (100*Px)/document.getElementById("GamePanel").offsetWidth;
}

function OnKeyPressed(Event)
{
    if(bCrashed == true)
    {
        OnGameStart();
    }
    if(Event.keyCode == 37)
    {
        KeyDirection="left";
    }
    else if(Event.keyCode == 39)
    {
        KeyDirection="right";
    }
    else if(Event.keyCode == 38)
    {
        KeyDirection="up";
    }
    else if(Event.keyCode == 40)
    {
        KeyDirection="down";
    } 
}

function Move()
{
    MoveSound.play(); 
    if(((KeyDirection == "up" || KeyDirection == "down") && (Direction != "up" && Direction != "down")) || (KeyDirection == "left" || KeyDirection == "right") && (Direction != "left" && Direction != "right"))
    {
        Direction = KeyDirection;
    }
    CheckCollision();
    if(bCrashed == false)
    {
        MoveTail();
        MoveHead();
        CheckTarget();
    }
}

function MoveHead()
{
    var GamePanel = document.getElementById("GamePanel");
    if(((KeyDirection == "up" || KeyDirection == "down") && (Direction != "up" && Direction != "down")) || (KeyDirection == "left" || KeyDirection == "right") && (Direction != "left" && Direction != "right"))
    {
        Direction = KeyDirection;
    }
    switch(Direction)
    {
        case 'up':
            var Top = Head.offsetTop / GamePanel.offsetHeight * 100;
            Head.style.top =  Math.round(Top - Step) + "%";  
        break;

        case 'down':
            var Top = Head.offsetTop / GamePanel.offsetHeight * 100;
            Head.style.top = Math.round(Top + Step) + "%";    
        break;

        case 'left':
            var Left = Head.offsetLeft / GamePanel.offsetWidth * 100;
            Head.style.left =  Math.round(Left - Step) + "%";   
        break;

        case 'right':
            var Left = Head.offsetLeft / GamePanel.offsetWidth * 100;
            Head.style.left =  Math.round(Left + Step) + "%";   
        break;
    }
}

function OnCrash()
{
    CrashSound.play();
    clearInterval(MovementTimer);
    Head.style.backgroundColor = "Orange";
    if(Score > Highscore)
    {
        localStorage.setItem('Data', Score);
    }
    ShowHUD();
 }
 
function CheckTarget()
{
    if(Head.offsetTop == Target.offsetTop && Head.offsetLeft == Target.offsetLeft)
    {
        EatSound.play(); 
        AddTail();
        RespawnTarget();
        Score += 1;
        document.getElementById("ScorePanel").innerHTML = "Score: " + Score;
    }
}

function RespawnTarget()
{
     var TargetLeft;
     var TargetTop;
     var Size = Tail.length;
     var bTargetTopGood = true;
     var bTargetLeftGood = true;
     
     do
     {
        TargetTop = Math.floor(Math.random() * 20) * TargetStep;
         bTargetTopGood = true;
        if(TargetTop == Head.style.top)
        {
            bTargetTopGood = false;
        }
        for(var i = 0; i<Size; i++)
        {
            if(TargetTop == Tail[i].style.top)
            {
                bTargetTopGood = false;
                break;
            }
        }
     }while(bTargetTopGood == false)

     do
     {
        TargetLeft = Math.floor(Math.random() * 20) * TargetStep;
         bTargetLeftGood = true;
        if(TargetLeft == Head.style.left)
        {
            bTargetLeftGood = false;
        }
        for(var i = 0; i<Size; i++)
        {
            if(TargetLeft == Tail[i].style.left)
            {
                bTargetLeftGood = false;
                break;
            }
        }
     }while(bTargetLeftGood == false)

     Target.style.top = TargetTop + "%";
     Target.style.left = TargetLeft + "%";
}

function AddTail()
{
    TailPart = document.createElement("div");
    TailPart.setAttribute("class" , "Tail");
    document.getElementById("GamePanel").appendChild(TailPart);
}

function MoveTail()
{
    if(Tail.length > 1)
    {
        var Size = Tail.length;
        for (var i = Size-1; i > 0 ; i--)
        {
            Tail[i].style.top = Tail[i-1].style.top;
            Tail[i].style.left = Tail[i-1].style.left;
        }
        Tail[0].style.top = Head.style.top;
        Tail[0].style.left = Head.style.left;  
    }
    else if(Tail.length == 1)
    {
        Tail[0].style.top = Head.style.top;
        Tail[0].style.left = Head.style.left;
    }
}

function CheckCollision()
{
    var GamePanel = document.getElementById("GamePanel");
    switch(Direction)
    {
        case 'up':
            if(Head.offsetTop > 0)
            {
                var Size = Tail.length;
                for(var i=0; i < Size; i++)
                {
                    if(Head.offsetTop == Tail[i].offsetTop + Head.offsetHeight && Head.offsetLeft == Tail[i].offsetLeft)
                    {
                        bCrashed = true;
                        OnCrash();
                        break;
                    }
                }
            }
            else
            {
                bCrashed = true;
                OnCrash();
            }
        break;

        case 'down':
            if(Head.offsetTop < GamePanel.offsetHeight - Head.offsetHeight)
            {
                var Size = Tail.length;
                for(var i=0; i < Size; i++)
                {
                    if(Head.offsetTop == Tail[i].offsetTop - Head.offsetHeight && Head.offsetLeft == Tail[i].offsetLeft)
                    {
                        bCrashed = true;
                        OnCrash();
                        break;
                    }
                }
            }
            else
            {
                bCrashed = true;
                OnCrash();
            }
        break;

        case 'left':
            if(Head.offsetLeft > 0)
            {
                var Size = Tail.length;
                for(var i=0; i < Size; i++)
                {
                    if(Head.offsetLeft == Tail[i].offsetLeft + Head.offsetWidth && Head.offsetTop == Tail[i].offsetTop)
                    {
                        bCrashed = true;
                        OnCrash();
                        break;
                    }
                }
            }
            else
            {
                bCrashed = true;
                OnCrash();
            }
        break;

        case 'right':
            if(Head.offsetLeft < GamePanel.offsetWidth - Head.offsetWidth)
            {
                var Size = Tail.length;
                for(var i=0; i < Size; i++)
                {
                    if(Head.offsetLeft == Tail[i].offsetLeft - Head.offsetWidth && Head.offsetTop == Tail[i].offsetTop)
                    {
                        bCrashed = true;
                        OnCrash();
                        break;
                    }
                }
            }
            else
            {
                bCrashed = true;
                OnCrash();
            }
        break;
    }
}

function BlinkBottomText()
{
    if( document.getElementById("BottomText").style.visibility == "visible")
    {
         document.getElementById("BottomText").style.visibility = "hidden";
    }
    else
    {
         document.getElementById("BottomText").style.visibility = "visible";
    }
}

function ShowHUD()
{
    var MainText = document.getElementById("MainText");
    var BottomText = document.getElementById("BottomText");
    MainText.innerHTML = "GAME OVER";
    BottomText.innerHTML = "Press any key to restart";
    HUDPanel.style.visibility = "visible";
    BlinkBottomTextTimer = setInterval(BlinkBottomText, 800);
}

function HideHUD()
{
    HUDPanel.style.visibility = "hidden";
    clearInterval(BlinkBottomTextTimer);
    document.getElementById("BottomText").style.visibility = "hidden";
}
