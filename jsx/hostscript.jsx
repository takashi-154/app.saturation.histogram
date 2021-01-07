/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

 
function showHistogram() {  

    // if the image is 16bit/channel or more it sets 8bits/channel before read the histogram  
    if (!activeDocument.bitsPerChannel == BitsPerChannelType.EIGHT) activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT; 
    
    var wasRulerUnits = app.preferences.rulerUnits;
    var wasTypeUnits = app.preferences.typeUnits;
    var wasDisplayDialogs = app.displayDialogs;
    var wasDocumentMode = app.activeDocument.mode;
    var savedState = app.activeDocument.activeHistoryState;

    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.PIXELS;
    app.displayDialogs = DialogModes.NO;
    app.activeDocument.mode = DocumentMode.RGB
    
    activeDocument.activeLayer = activeDocument.layers[0];
    activeDocument.quickMaskMode = false;

    try {
        activeDocument.backgroundLayer.isBackgroundLayer = false;
    } catch (e) {
    }

    activeDocument.activeLayer = activeDocument.layers[0];
    activeDocument.artLayers.add();

    uniqueId = new Date().getTime().toString(16) + Math.floor(1000*Math.random()).toString(16);
    activeDocument.duplicate(uniqueId, true);
    activeDocument.activeLayer.copy();
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);

    var flag = true;
    try {
        var selected = activeDocument.selection.bounds;
        activeDocument.selection.invert();
    } catch (e) {
        flag = false;
    }
    
    var wasLayerLength = activeDocument.layers.length;
    var copyIndex = [];
    for (var i = 0; i < wasLayerLength; i++) {
        var index = i;
        if (activeDocument.layers[index].visible) {
            copyIndex.push(index);
            activeDocument.layers[index].visible = false;
        }
    }

    activeDocument.activeLayer = activeDocument.layers[0];

    if (flag) {
        var maxSObj = new SolidColor();
        maxSObj.rgb.red = 0;
        maxSObj.rgb.green = 255;
        maxSObj.rgb.blue = 0;
        var minSObj = new SolidColor();
        minSObj.rgb.red = 0;
        minSObj.rgb.green = 0;
        minSObj.rgb.blue = 0;

        activeDocument.activeLayer = activeDocument.layers[0];
        activeDocument.artLayers.add();
        activeDocument.selection.fill(maxSObj);
        activeDocument.activeLayer = activeDocument.layers[0];
        activeDocument.artLayers.add();
        activeDocument.selection.fill(minSObj);
        activeDocument.activeLayer = activeDocument.layers[0];

        activeDocument.artLayers.add();
        activeDocument.paste();
        activeDocument.activeLayer = activeDocument.layers[0];
        activeDocument.activeLayer.visible = true;
        var idHsbP = charIDToTypeID( "HsbP" );
        var desc = new ActionDescriptor();
        var idInpt = charIDToTypeID( "Inpt" );
        var idClrS = charIDToTypeID( "ClrS" );
        var idRGBC = charIDToTypeID( "RGBC" );
        desc.putEnumerated( idInpt, idClrS, idRGBC );
        var idOtpt = charIDToTypeID( "Otpt" );
        var idClrS = charIDToTypeID( "ClrS" );
        var idHSBl = charIDToTypeID( "HSBl" );
        desc.putEnumerated( idOtpt, idClrS, idHSBl );
        executeAction( idHsbP, desc, DialogModes.NO );

        activeDocument.activeLayer = activeDocument.layers[0];
        activeDocument.activeLayer.move(activeDocument.layers[2], ElementPlacement.PLACEAFTER);

        activeDocument.layers[0].visible = false;
        activeDocument.layers[1].visible = true;
        var hSmax = activeDocument.channels[1].histogram;

        activeDocument.layers[0].visible = true;
        activeDocument.layers[1].visible = false;
        var hSmin = activeDocument.channels[1].histogram;

        var hS = hSmin.slice();
        hS[0] = hSmax[0];

    } else {
        activeDocument.artLayers.add();
        activeDocument.paste();
        activeDocument.activeLayer = activeDocument.layers[0];
        activeDocument.activeLayer.visible = true;
        var idHsbP = charIDToTypeID( "HsbP" );
        var desc = new ActionDescriptor();
        var idInpt = charIDToTypeID( "Inpt" );
        var idClrS = charIDToTypeID( "ClrS" );
        var idRGBC = charIDToTypeID( "RGBC" );
        desc.putEnumerated( idInpt, idClrS, idRGBC );
        var idOtpt = charIDToTypeID( "Otpt" );
        var idClrS = charIDToTypeID( "ClrS" );
        var idHSBl = charIDToTypeID( "HSBl" );
        desc.putEnumerated( idOtpt, idClrS, idHSBl );
        executeAction( idHsbP, desc, DialogModes.NO );
        
        activeDocument.activeLayer = activeDocument.layers[0];
        var hS = activeDocument.channels[1].histogram;
    }

    app.activeDocument.activeHistoryState = savedState;
    app.preferences.rulerUnits = wasRulerUnits;
    app.preferences.typeUnits = wasTypeUnits;
    app.displayDialogs = wasDisplayDialogs;
    app.activeDocument.mode = wasDocumentMode;

    $.gc();  

    return hS;
    
}  