function sleeping() {
    return new Promise(resolve => setTimeout(resolve, 28800));
}
function coding() {
    return new Promise(resolve => setTimeout(resolve, 36000));
}
function eating() {
    return new Promise(resolve => setTimeout(resolve, 7200));
}
function debugging() {
    return new Promise(resolve => setTimeout(resolve, 10800));
}
async function code(day) {

    console.log("Sleeping");
    await sleeping();

    console.log("Coding for 10 hours!");
    await coding();

    console.log("Eating");
    await eating();

    console.log("Debug for 10 hours!");
    await debugging();

}

(async function processLife() {
    for (const day of life)
        await code(day);
})();