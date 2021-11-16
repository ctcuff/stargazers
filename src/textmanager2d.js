// This is a very rudimentary setup which is designed to simply display some text as per the '#overlay' section of the CSS file.
// When complete, it could include some functionality to accomodate animations, resizing, and other effects.
// A TextManager3D class may come in the future, which would ideally be implemented with our WebGL context.

class TextManager2D
{
    constructor()
    {
        this.scoreField = document.querySelector("#score");
        this.scoreNode = document.createTextNode("");
        this.scoreField.appendChild(this.scoreNode);

        // this.centerField = document.querySelector("#center-text");
        // this.centerFieldNode = document.createTextNode("");
        // this.centerField.appendChild(this.centerFieldNode);
    }

    updateScore(text)
    {
        this.scoreNode.nodeValue = text;
    }

    displayCenterText(text)
    {

    }
}

export default TextManager2D;