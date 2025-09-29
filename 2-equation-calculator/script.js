function calcAreaTrap(base1 , base2 , height) {
    let area = (parseInt(base1) + parseInt(base2)) / 2 * parseInt(height);

    $('#area').html(area);
}

function calcRightCircularCylinder(base, height, radius){
    let exactSurfaceArea =  2 * radius * height + 2 * radius * radius;
    let approximateSufaceArea = exactSurfaceArea * Math.PI;

    let volume = base * height

    $('#SurfaceAreaExact').html("Exact Surface Area = "  + exactSurfaceArea + "&pi;");
    $('#SurfaceAreaApproximate').html("Approximate Surface Area &asymp; " + approximateSufaceArea);

    $('#volume').html("Volume: " + volume);
}


function calcCone(base, height){
    let area = (1/3) * base * height;
    $('#coneArea').html("Area: " + area);
}