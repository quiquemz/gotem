function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function cleanString(text) {
    return text.replace(/[.#$[\]]/g, '');
}

document.addEventListener('DOMContentLoaded', function() {

    /*** Firebase ***/
    const auth = firebase.auth();
    const db = firebase.database();
    const storage = firebase.storage();

    /*** Constants ***/
    const PAD = 10;

    /*** HTML elements ***/
    const memeCard = document.getElementById('meme-card');
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    const img = document.createElement('img');
    const topText = document.getElementById('top-text-input');
    const topSizer = document.getElementById('top-text-size');
    const urlInput = document.getElementById('url-input');
    const fileInput = document.getElementById('file-input');
    const downloadMemeAnchor = document.getElementById('download-btn');
    const copyLinkAnchor = document.getElementById('copy-link-btn');
    const saveToLibraryBtn = document.getElementById('save-to-library-btn');
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagsContainer = document.getElementById('tags-container');
    const tagInput = document.getElementById('tag-input');

    /*** Input for user ***/
    let topTextVal = topText.value.toUpperCase();
    let topSizeVal = topSizer.value;
    let bottomText = document.getElementById('bottom-text-input');
    let bottomSizer = document.getElementById('bottom-text-size');
    let bottomTextVal = bottomText.value.toUpperCase();
    let bottomSizeVal = bottomSizer.value;
    let tagInputVal = tagInput.value.toLowerCase();

    /*** Function definitions ***/
    function initializeHTML(currentImgObj) {
        console.log(currentImgObj);
        if(currentImgObj.original.startsWith('gs://')) {
            storage.refFromURL(currentImgObj.original).getDownloadURL().then(function(url){
                img.src = url;
            }).catch(function(err) {
                alert('Image could not be loaded. Loading different one instead.');
                img.src = 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg';

            });
        } else if(currentImgObj.original.startsWith('https://firebasestorage.googleapis.com')) {
            img.src = currentImgObj.original;

        } else {
            alert('Image could not be loaded. Loading different one instead.');
            img.src = 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg';

        }

        topText.value = topTextVal = currentImgObj.topText;
        topSizer.value = topSizeVal = currentImgObj.topSize;
        bottomText.value = bottomTextVal = currentImgObj.bottomText;
        bottomSizer.value = bottomSizeVal = currentImgObj.bottomSize;

        topSizer.labels[0].childNodes[1].innerText = topSizeVal;
        bottomSizer.labels[0].childNodes[1].innerText = bottomSizeVal;

        currentImgObj.tags.forEach(tag => createTagElmt(tag));

        localStorage.setItem('currentImg', JSON.stringify(currentImgObj));
    }

    function drawMemeOnCanvas() {

        // Canvas Part
        if(memeCard.hasChildNodes()) {
            try{
                memeCard.removeChild(canvas);
                delete(canvas);
                canvas = document.createElement('canvas');
            } catch (e) {
                console.warn(e);
            }
        }

        memeCard.appendChild(img);

        canvas.height = img.height;
        canvas.width = img.width;

        ctx = canvas.getContext("2d");
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

        ctx.drawBreakingText(topTextVal.toUpperCase(), canvas.width/2, PAD, null, 1, 'fill');
        ctx.drawBreakingText(topTextVal.toUpperCase(), canvas.width/2, PAD, null, 1, 'stroke');

        // Bottom Text Part
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = canvas.width*0.004;

        ctx.font = bottomSizeVal + 'px ' + 'Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        let tempHeight = ctx.drawBreakingText(bottomTextVal.toUpperCase(), 0, 0, null, 1, 'none').textHeight;

        ctx.drawBreakingText(bottomTextVal.toUpperCase(), canvas.width/2, canvas.height-tempHeight-PAD, null, 1, 'fill');
        ctx.drawBreakingText(bottomTextVal.toUpperCase(), canvas.width/2, canvas.height-tempHeight-PAD, null, 1, 'stroke');
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

        navigator.clipboard.writeText(text)
            .then(function() {
                alert('Copied link to clipboard.\nPaste to share.');
            }).catch(function(err) {
                console.error('Async: Could not copy text: ', err);
            });
    }

    function createTagElmt(text) {
        const tagElmt = `<span class="tag">${text}</span>`;

        if(!text)
            return;

        if(Array.from(tagsContainer.children).map((e) => e.innerText).includes(text)) {
            alert("Tag already included");
            return;
        }

        tagsContainer.insertAdjacentHTML('beforeend', tagElmt);

        // TODO add tag to DB, or properties of Meme
        // NOTE: Make sure to add only if doesn't exist
    }

    function updateLocalStorage() {
        let currentImg = JSON.parse(localStorage.getItem('currentImg'));

        if(!currentImg) {
            initializeHTML({
                time: Date.now(),
                original: img.src,
                edited: '',
                topText: topText.value,
                topSize: topSizer.value,
                bottomText: bottomText.value,
                bottomSize: bottomSizer.value,
                tags: Array.from(tagsContainer.children).map((e) => e.innerText)
            });

            currentImg = JSON.parse(localStorage.getItem('currentImg'));
        }

        currentImg.topText = topText.value;
        currentImg.topSize = topSizer.value;
        currentImg.bottomText = bottomText.value;
        currentImg.bottomSize = bottomSizer.value;

        currentImg.tags = Array.from(tagsContainer.children).map((e) => e.innerText);

        currentImg.original = img.src;
        currentImg.time = Date.now();

        localStorage.setItem('currentImg', JSON.stringify(currentImg));
    }

    /*** Initializing app ***/
    if(localStorage.getItem('currentImg') && localStorage.getItem('currentImg').time) {
        initializeHTML(JSON.parse(localStorage.getItem('currentImg')));
    } else {
        initializeHTML({
            time: Date.now(),
            original: 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg',
            edited: '',
            topText: 'Top Text',
            topSize: 40,
            bottomText: 'Bottom Tet',
            bottomSize: 40,
            tags: []
        });
    }

    /*** Event Handlers ***/
    auth.onAuthStateChanged(function(user) {
        if(!user) {
            window.location.assign('auth.html');
        } else {
            console.log('Logged in?');
        }
    });

    // Draw image on load
    img.onload = function() {
        drawMemeOnCanvas();
        updateLocalStorage();
    };

    // Draw image on top text input change
    topText.oninput = function() {
        topTextVal = topText.value.toUpperCase();
        drawMemeOnCanvas();
        updateLocalStorage();
    };

    // Draw image on top text input change
    topSizer.oninput = function() {
        topSizeVal = topSizer.value;
        topSizer.labels[0].childNodes[1].innerText = topSizeVal;
        drawMemeOnCanvas();
        updateLocalStorage();
    };

    // Draw image on bottom text input change
    bottomText.oninput = function() {
        bottomTextVal = bottomText.value.toUpperCase();
        drawMemeOnCanvas();
        updateLocalStorage();
    };

    // Draw image on bottom text input change
    bottomSizer.oninput = function() {
        bottomSizeVal = bottomSizer.value;
        bottomSizer.labels[0].childNodes[1].innerText = bottomSizeVal;
        drawMemeOnCanvas();
        updateLocalStorage();
    };

    // Draw image on url input change
    urlInput.oninput = function() {
        img.src = urlInput.value;
        fileInput.value = '';
    };

    // Draw image on file upload
    fileInput.onchange = function(e) {
        const file = e.target.files[0];

        if(!file) return;

        img.src = URL.createObjectURL(file);
        urlInput.value = '';

    };

    // Draw image on window resize
    window.onresize = function() {
        drawMemeOnCanvas();
    };

    // Copy meme link to clipboard
    copyLinkAnchor.onclick = function(e) {
        e.preventDefault();

        let flattenedLocalImgUrl = '';

        try {
            flattenedLocalImgUrl = canvas.toDataURL('image/png');
        } catch (e) {
            console.log(img.crossOrigin);
        }

        // TODO Copy public link, NOT local
        copyTextToClipboard(flattenedLocalImgUrl);
    };

    // Download meme
    downloadMemeAnchor.onclick = function() {
        updateLocalStorage();
        let flattenedLocalImgUrl = '';

        try {
            flattenedLocalImgUrl = canvas.toDataURL('image/png');
        } catch (e) {
            alert('Cannot download');
        }

        // TODO create downloadable link
        this.href = flattenedLocalImgUrl;
    };

    // Save meme to library
    saveToLibraryBtn.onclick = function() {
        let flattenedLocalImgUrl = '';
        let storageOriginaUrl = '';
        let storageEditedUrl = '';
        let currentImg = localStorage.getItem('currentImg');
        let storageRef = storage.ref();
        let storageOriginalRef = '';
        let storageEditedRef = '';

        try {
            flattenedLocalImgUrl = canvas.toDataURL('image/png');
        } catch (e) {
            alert('Cannot save to library');
            return;
        }

        if(currentImg) {
            currentImg = JSON.parse(currentImg);
            storageOriginaUrl = currentImg.original;
            storageEditedUrl = currentImg.edited;
        } else {
            storageOriginaUrl = topTextVal + topSizeVal + bottomTextVal + bottomSizeVal;
            storageEditedUrl = 'edited_' + storageOriginaUrl;
        }

        storageOriginalRef = storageRef.child(`images/${storageOriginaUrl}`);
        storageEditedRef = storageRef.child(`images/${storageEditedUrl}`);

        /* For original */
        if(img.src.startsWith('http')) {
            storageOriginalRef.set(img.src);
        } else {
            console.log(img.src);
        }

        /* for edited */
        canvas.toBlob(function(blob) {
            storageEditedRef.put(blob).then(function(snapshot) {
                db.ref(`users/${auth.currentUser.uid}/memes/${cleanString(currentImg.original)}`).set({
                    time: Date.now(),
                    original: currentImg.original,
                    edited: currentImg.edited,
                    topText: currentImg.topText,
                    topSize: currentImg.topSize,
                    bottomText: currentImg.bottomText,
                    bottomSize: currentImg.bottomSize,
                    tags: currentImg.tags
                })
            })
        });

        /*
        * TODO Save to DB:
        * 1. Original img
        * 2. Flatten img
        * 3. top fields (text, size)
        * 4. bottom fields (text, size)
        * 5. Tags (both to set and object)
        * 6. updateLocalStorage();
        * */

    };

    // Add tag
    addTagBtn.onclick = function() {
        createTagElmt(tagInput.value);
        tagInput.value = '';

        updateLocalStorage();
    };

});