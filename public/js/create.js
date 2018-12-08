document.addEventListener('DOMContentLoaded', function() {

    /*** Constants ***/
    const PAD = 10;

    /*** HTML elements ***/
    const memeCard = document.getElementById('meme-card');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const img = document.createElement('img');
    const topText = document.getElementById('top-text-input');
    const topSizer = document.getElementById('top-text-size');
    const urlInput = document.getElementById('url-input');
    const fileInput = document.getElementById('file-input');
    const downloadMemeAnchor = document.getElementById('download-btn');
    const copyLinkAnchor = document.getElementById('copy-link-btn');
    const saveToLibraryBtn = document.getElementById('save-to-library-btn');
    const addTagBtn = document.getElementById('add-tag-btn');

    /*** Input for user ***/
    let topTextVal = topText.value.toUpperCase();
    let topSizeVal = topSizer.value;
    let bottomText = document.getElementById('bottom-text-input');
    let bottomSizer = document.getElementById('bottom-text-size');
    let bottomTextVal = bottomText.value.toUpperCase();
    let bottomSizeVal = bottomSizer.value;

    /*** Function definitions ***/
    function draw() {

        // Canvas Part
        if(memeCard.hasChildNodes()) {
            memeCard.removeChild(canvas);
        }

        memeCard.appendChild(img);

        canvas.height = img.height;
        canvas.width = img.width;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        memeCard.removeChild(img);
        memeCard.appendChild(canvas);

        // Top Text Part
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = canvas.width*0.004;

        ctx.font = topSizeVal + 'px ' + 'Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        ctx.drawBreakingText(topTextVal, canvas.width/2, PAD, null, 1, 'fill');
        ctx.drawBreakingText(topTextVal, canvas.width/2, PAD, null, 1, 'stroke');

        // Bottom Text Part
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = canvas.width*0.004;

        ctx.font = bottomSizeVal + 'px ' + 'Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        ctx.drawBreakingText(bottomTextVal, canvas.width/2, canvas.height-PAD, null, 1, 'fill');
        ctx.drawBreakingText(bottomTextVal, canvas.width/2, canvas.height-PAD, null, 1, 'stroke');
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful.\nPaste to share.' : 'unsuccessful.\nPlease try again.';

            alert('Copied link: ' + msg);

        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            alert('Copied link to clipboard.\nPaste to share.');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    /*** Event Handlers ***/
    // Draw image on load
    img.onload = function() {
        draw();
    };

    // Draw image on top text input change
    topText.oninput = function() {
        topTextVal = topText.value.toUpperCase();

        draw();
    };

    // Draw image on top text input change
    topSizer.oninput = function() {
        topSizeVal = topSizer.value;
        topSizer.labels[0].childNodes[1].innerText = topSizeVal;

        draw();
    };

    // Draw image on bottom text input change
    bottomText.oninput = function() {
        bottomTextVal = bottomText.value.toUpperCase();

        draw();
    };

    // Draw image on bottom text input change
    bottomSizer.oninput = function() {
        bottomSizeVal = bottomSizer.value;
        bottomSizer.labels[0].childNodes[1].innerText = bottomSizeVal;

        draw();
    };

    // Draw image on url input change
    urlInput.oninput = function() {
        img.src = urlInput.value;
    };

    // Draw image on file upload
    fileInput.onchange = function(e) {
        const file = e.target.files[0];

        if(!file)
            return;

        img.src = URL.createObjectURL(file);
    };

    // Draw image on window resize
    window.onresize = function() {
        draw();
    };

    // Copy meme link to clipboard
    copyLinkAnchor.onclick = function(e) {
        e.preventDefault();

        let flattenImgLocalUrl = canvas.toDataURL('image/jpg');

        // TODO Copy public link, NOT local
        copyTextToClipboard(flattenImgLocalUrl);
    };

    // Download meme
    downloadMemeAnchor.onclick = function() {
        let flattenImg = canvas.toDataURL('image/jpg');
        this.href = flattenImg;
    };

    // Save meme to library
    saveToLibraryBtn.onclick = function() {
        let flattenImg = canvas.toDataURL('image/jpg');

        /*
        * TODO Save to DB:
        * 1. Original img
        * 2. Flatten img
        * 3. top fields (text, size)
        * 4. bottom fields (text, size)
        * 5. Tags (both to set and object)
        * */

    };

    // Add tag
    addTagBtn.onclick = function() {
        const tagsContainer = document.getElementById('tags-container');
        const tagInput = document.getElementById('tag-input');
        let tagInputVal = tagInput.value.toLowerCase();
        const tagEl = `<span class="tag">${tagInputVal}</span>`;

        if(!tagInputVal)
            return;

        if(Array.from(tagsContainer.children).map((e) => e.innerText).includes(tagInputVal)) {
            alert("Tag already included");
            return;
        }

        tagsContainer.insertAdjacentHTML('beforeend', tagEl);
        tagInput.value = '';


        // TODO add tag to DB, or properties of Meme
    };

    /*** Initializing state of app ***/
    // Setting default image
    img.src = 'img/meme6.jpg';
    img.crossOrigin = 'anonymus';
});