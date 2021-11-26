class TextManager2D
{
    constructor()
    {
        this.scoreField = document.querySelector("#score");
        this.scoreNode = document.createTextNode("");
        this.scoreField.appendChild(this.scoreNode);

        this.centerField = document.querySelector("#center-text");
        this.centerFieldNode = document.createTextNode("");
        this.centerField.appendChild(this.centerFieldNode);
    }

    updateScore(text)
    {
        this.scoreNode.nodeValue = text;
    }

    updateCenterText(text)
    {
        this.centerFieldNode.nodeValue = text;
    }

    disableCenterText()
    {
        this.centerField.style.visibility = "hidden";
    }

    enableCenterText()
    {
        this.centerField.style.visibility = "visible";
    }
}

export default TextManager2D;