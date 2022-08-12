
document.onload = function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);

    document.getElementById("out").innerHTML = JSON.stringify(params);
}