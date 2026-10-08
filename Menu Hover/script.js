document.addEventListener("DOMContentLoaded", () => {

    const imgContainer = document.querySelector(".imgContainer");
    const imgBlocks = document.querySelector(".imgBlocks");

    const resetDuration = 300;
    const blockSize = 65;

    const imgContainerWidth = imgContainer.offsetWidth;
    const imgContainerHeight = imgContainer.offsetHeight;

    const numCols = Math.floor(imgContainerWidth / blockSize);
    const numRows = Math.floor(imgContainerHeight / blockSize);

    const blockWidth = imgContainerHeight / numCols;
    const blockHeight = imgContainerWidth / numRows;

    imgBlocks.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    imgBlocks.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

    imgBlocks.style.width = `${imgContainerWidth}px`;
    imgBlocks.style.height = `${imgContainerHeight}px`;

    let blocks = [];
    function createBlocks() {
        const numBlocks = numCols * numRows;
        for (let i = 0; i < numBlocks; i++) {
            const block = document.createElement("div");
            block.classList.add("blocks");
            block.style.width = `${blockWidth}px`;
            block.style.height = `${blockHeight}px`;
            imgBlocks.appendChild(block);
            blocks.push(block);
        }
    }
    createBlocks();

    blocks.forEach((block) => {
        let timeoutId;
        block.addEventListener("mouseenter", () => {
            clearTimeout(timeoutId);
            block.classList.add("active");
            timeoutId = setTimeout(() => {
                block.classList.remove("active");
            }, resetDuration);
        });
    });
});

