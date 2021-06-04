
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



function OnLoad()
{
    OnResize();
    Direction="down";
    MovementTimer = setInterval(Move, 200);
    Head = document.createElement("div");
    Head.setAttribute("id","Head");
    document.getElementById("GamePanel").appendChild(Head);
    Head.style.top = "0%";
    Head.style.left = "50%";
    Target = document.createElement("div");
    Target.setAttribute("id","Target");
    document.getElementById("GamePanel").appendChild(Target);
    OnResize();
    RespawnTarget();
}

function OnResize()
{
    var GamePanel = document.getElementById("GamePanel");
    var InGamePanel = document.getElementById("InGamePanel");
    if(window.innerWidth > window.innerHeight)
    {
        GamePanel.style.width = 100 + "vh";
        GamePanel.style.height = 100 + "vh";
    }
    else if(window.innerWidth < window.innerHeight)
    {
        GamePanel.style.width = 100 + "vw";
        GamePanel.style.height = 100 + "vw";
    }
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
    if(Event.keyCode == 37)
    {
        KeyDirection="left";
    }
    else if(Event.keyCode == 39)
    {
        KeyDirection="right";
    }
    if(Event.keyCode == 38)
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
    MoveTail();
    MoveHead();
    CheckTarget();
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
            if(Head.offsetTop > 0)
            {
                var Top = Head.offsetTop / GamePanel.offsetHeight * 100;
                Head.style.top =  Math.round(Top - Step) + "%";
            }
            else
            {
                OnCrash();
            }
        break;

        case 'down':
            if(Head.offsetTop < GamePanel.offsetHeight - Head.offsetHeight)
            {
                var Top = Head.offsetTop / GamePanel.offsetHeight * 100;
                Head.style.top = Math.round(Top + Step) + "%";
            }
            else
            {
               OnCrash();
            }
        break;

        case 'left':
            if(Head.offsetLeft > 0)
            {
                var Left = Head.offsetLeft / GamePanel.offsetWidth * 100;
                Head.style.left =  Math.round(Left - Step) + "%";
            }
            else
            {
                OnCrash();
            }
        break;

        case 'right':
            if(Head.offsetLeft < GamePanel.offsetWidth - Head.offsetWidth)
            {
                var Left = Head.offsetLeft / GamePanel.offsetWidth * 100;
                Head.style.left =  Math.round(Left + Step) + "%";
            }
            else
            {
                OnCrash();
            }
        break;
    }
}

function OnCrash()
{
    Head.parentNode.removeChild(Head);
    var Size = Tail.length;
    Target.innerHTML = Size;
    var i;
    for(i = 0; i<Size; i++)
    {
        Tail[i].parentNode.removeChild(Tail[i]);
    }
}

function CheckTarget()
{
    if(Head.offsetTop == Target.offsetTop && Head.offsetLeft == Target.offsetLeft)
    {
        AddTail();
        RespawnTarget();
    }
}

function RespawnTarget()
{
    do
    {
        var TargetTop = Math.floor(Math.random() * 20) * TargetStep;
    }while(TargetTop == Head.style.top)
    do
    {
        var TargetLeft = Math.floor(Math.random() * 20) * TargetStep;
    }while(TargetLeft == Head.style.left)
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
    Tail = document.getElementsByClassName("Tail");
    if(Tail[0] != null)
    {
        Tail[0].style.top = Head.style.top;
        Tail[0].style.left = Head.style.left;
    }
}
