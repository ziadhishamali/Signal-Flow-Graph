function App() {

    // gui derived data
    this.nodes = {};
    this.edges = [];
    this.arrIdsTemp;

    // forward paths variables
    this.numForwardPaths = 0;
    this.gains = [];
    this.forwardPaths = [];

    // loops variables
    this.loopsGain = [];
    this.loopsPaths = [];
    this.loopsPathsRefined = [];
    this.loopsGainRefined = [];

    // temporarily variable
    this.pathsOfloops = [];

    // untouched loops variables
    this.untouched = [[]];
    this.untouchedRefined = [[]];
    this.untouchedGains = [[]];
    this.untouchedGainsRefined = [[]];
    this.lengthOfUntouched = 0;

    // delta index variables
    this.deltaIndex = [[]];
    this.deltaIndexGain = [[]];
    this.lengthOfdeltaIndexLoop = 0;
    this.deltaIndexNum = [];
    this.deltaIndexWords = [];


// function to fill the nodes array
    this.fillNodes = function (guiNodes) {
        // put logic here
        this.nodes = {};
        this.arrIdsTemp = guiNodes.getIds();
        console.log("testing ids temp: " + this.arrIdsTemp[this.arrIdsTemp.length - 1] + " type: " + typeof(this.arrIdsTemp[this.arrIdsTemp.length - 1]));
        let arrIds = guiNodes.getIds();

        /*for (let i = 0; i < arrIds.length; i++) {
            guiNodes.update(arrIds[i]);
        }*/

        for (let i = 0; i < arrIds.length; i++) {
            console.log("node " + (i + 1) + " label: " + guiNodes.get(arrIds[i]).label);
            console.log("node " + (i + 1) + " id: " + arrIds[i]);
            this.nodes[arrIds[i]] = new NodeC(i + 1, guiNodes.get(arrIds[i]).label);
        }

        for (let x in this.nodes) {
            console.log("testing nodes array: " + x + " : " + this.nodes[x]);
        }
    };

// function to fill the edges array
    this.fillEdges = function (guiEdges) {
        // put logic here

        console.log("in fill edges nodes length: " + (Object.keys(this.nodes)).length);

        this.edges = [];

        let edge = null;

        let arrIds = guiEdges.getIds();

        for (let i = 0; i < arrIds.length; i++) {

            let gain = parseFloat(guiEdges.get(arrIds[i]).label);
            let from = this.nodes[guiEdges.get(arrIds[i]).from];
            let to = this.nodes[guiEdges.get(arrIds[i]).to];

            console.log();
            console.log("gain: " + gain);
            console.log("from: " + from);
            console.log("to: " + to);

            edge = new Edge(from, to, gain);
            this.nodes[guiEdges.get(arrIds[i]).from].addEdge(edge);
            this.edges.push(edge);

        }

        // logging each node with the gain of its edges
        for(let i = 0; i < (Object.keys(this.nodes)).length; i++) {
            let nodeTemp = this.nodes[this.arrIdsTemp[i]];
            console.log("Node " + nodeTemp.name);
            for (let j = 0; j < nodeTemp.edges.length; j++) {
                let edgeTemp = nodeTemp.edges[j];
                console.log("     to: " + edgeTemp.to + "  gain: " + edgeTemp.gain);
            }
        }

    };

    // function to get boolean intersect or not
    this.isIntersected = function (first, second) {
        let counter = 0;
        for (let i = 0; i < first.length; i++){
            let x = first[i];
            for (let j = 0; j < second.length; j++){
                let y = second[j];
                if (x == y){
                    return true;
                }
            }
        }
        return false;
    };

// function to get a Loop
    this.getLoop = function (first, second, i){

        let tempArr = [];

        for (let i = 0; i < first.length; i++) {
            tempArr.push(first[i]);
        }
        for (let j = 0; j < second.length; j++){
            tempArr.push(second[j]);
        }
        return tempArr;



    };



// DFS for forward paths
    this.DFS = function () {

        //put DFS recursive logic heres

        var s = [];

        var sGain = [];

        var sNodes = [];

        var outputNode = this.nodes[this.arrIdsTemp[this.arrIdsTemp.length - 1]];

        var visited = [];

        for (let i = 0; i < (Object.keys(this.nodes)).length; i++) {
            visited.push(0);
        }



        console.log("temp node id: " + this.arrIdsTemp[this.arrIdsTemp.length - 1]);
        s.push(this.nodes[this.arrIdsTemp[0]]);
        let tStartNode = [];
        tStartNode.push(this.nodes[this.arrIdsTemp[0]]);
        sNodes.push(tStartNode);
        console.log("sNodes: " + sNodes);
        sGain.push(1);

        while (s.length != 0) {

            console.log("stack length: " + s.length);

            let node = s.pop();

            console.log("popped node: " + node);

            let gain = sGain.pop();

            let tempNodes = sNodes.pop();

            console.log("tempNode: " + tempNodes);

            console.log("visited length: " + visited.length);

            visited[node.name - 1] = 1;

            console.log("Visited array : " + visited);
            console.log("DFS node: " + node.name + ", gain: " + gain);

            if (node == outputNode) {
                // backtracking
                this.numForwardPaths++;
                this.gains.push(gain);
                // push tempNodes to your array ya youssef XD we isa tmm
                console.log("forward path: ");
                for (let i = 0; i < tempNodes.length; i++) {
                    console.log("     " + tempNodes[i].id);
                    tempNodes[i] = tempNodes[i].id;
                }
                this.forwardPaths.push(tempNodes);
                let temp = s[s.length - 1];
                if (temp == null) {
                    continue;
                }
                console.log("temp node: " + temp.name);
                for (let i = temp.name; i < Object.keys(this.nodes).length; i++) {
                    visited[i] = 0;
                }
                visited[outputNode.name - 1] = 0;
                continue;
            }

            console.log("num:  " + node.edges.length);
            for (let i = 0; i < node.edges.length; i++) {
                if ( visited[node.edges[i].to.name - 1] == 0) {

                    let tempOfTemp = [];

                    for (let j = 0; j < tempNodes.length; j++) {
                        tempOfTemp.push(tempNodes[j]);
                    }

                    tempOfTemp.push(node.edges[i].to);
                    sNodes.push(tempOfTemp);
                    console.log("temp " + node.edges[i].gain);
                    s.push(node.edges[i].to);
                    sGain.push(gain * node.edges[i].gain);
                }
            }
        }

        /*console.log("FORWARD PATHS ..");
        for (let x = 0; x < this.forwardPaths.length; x++){
            var arr = this.forwardPaths[x];
            console.log("PATH IS : ");
            for (let f = 0; f < arr.length; f++){
                console.log(arr[f]);
            }
        }*/

    };








    // DFS function for loops
    this.DFSLoops = function () {

        // put logic here

        var visited = [];

        for (let l = 0; l < (Object.keys(this.nodes)).length; l++) {
            visited.push(0);
        }

        for (let i = 1; i < (Object.keys(this.nodes)).length; i++) {

            var s = [];

            var sGain = [];

            var sNodes = [];

            var outputNode = this.nodes[this.arrIdsTemp[i - 1]];

            s.push(this.nodes[this.arrIdsTemp[i - 1]]);
            sNodes.push([]);
            sGain.push(1);

            let flagStart = true;

            while (s.length !== 0) {

                let node = s.pop();
                let tempNodes = sNodes.pop();
                let gain = sGain.pop();

                console.log("looping.. current node: " + node.name);
                console.log("looping.. current stack" + s);

                // base case
                if (node === outputNode && !flagStart) {

                    console.log("I am here !!! " + node.name);

                    console.log("Gain found: " + gain);
                    console.log("loop path found: " + tempNodes);
                    this.loopsGain.push(gain);
                    console.log("loopsGain size became: " + this.loopsGain.length);
                    this.loopsPaths.push(tempNodes);
                    console.log("loopsPaths size became: " + this.loopsPaths.length);

                    continue;

                } else if (flagStart) {

                    flagStart = false;

                }

                for (let i = 0; i < node.edges.length; i++) {
                    console.log("the index of node " + node.edges[i].to.name + " : " + tempNodes.indexOf(node.edges[i].to));
                    console.log("the visited of " + node.edges[i].to.name + ": " + visited[node.edges[i].to.name - 1])
                    if (tempNodes.indexOf(node.edges[i].to) === -1 && visited[node.edges[i].to.name - 1] !== 1) {

                        let tempOfTemp = [];

                        for (let j = 0; j < tempNodes.length; j++) {
                            tempOfTemp.push(tempNodes[j]);
                        }

                        s.push(node.edges[i].to);
                        tempOfTemp.push(node.edges[i].to);
                        sNodes.push(tempOfTemp);
                        sGain.push(gain * node.edges[i].gain);
                        console.log("looping.. added 'to' node: " + node.edges[i].to.name);
                    }

                }

                console.log("");
                console.log("");

            }

            visited[i - 1] = 1;

        }

        this.loopsPathsRefined.push(this.loopsPaths[0]);
        this.loopsGainRefined.push(this.loopsGain[0]);

        let newPath = true;
        let addNewPathPlz = true;

        for (let j = 0; j < this.loopsPaths.length; j++) {

            let counterFlag = 0;

            let temporaryArray = [];

            for (let z = 0; z < this.loopsPaths[j].length; z++) {
                temporaryArray.push(this.loopsPaths[j][z].id);
            }
            console.log("1 before sorting: " + temporaryArray);
            temporaryArray.sort();
            console.log("1 after sorting: " + temporaryArray);

            for (let k = 0; k < this.loopsPathsRefined.length; k++) {

                let temporaryArray2 = [];

                for (let z = 0; z < this.loopsPathsRefined[k].length; z++) {
                    temporaryArray2.push(this.loopsPathsRefined[k][z].id);
                }
                console.log("2 before sorting: " + temporaryArray2);
                temporaryArray2.sort();
                console.log("2 after sorting: " + temporaryArray2);

                if (this.loopsPaths[j].length !== this.loopsPathsRefined[k].length) {

                    counterFlag++;
                    continue;

                }

                let temporaryFlag = false;
                for (let l = 0; l < this.loopsPathsRefined[k].length; l++) {

                    if (this.loopsPaths[j].length === this.loopsPathsRefined[k].length) {

                        for (let y = 0; y < temporaryArray.length; y++) {
                            if (temporaryArray[y] !== temporaryArray2[y]) {
                                temporaryFlag = true;
                                break;
                            }
                        }

                        if (temporaryFlag) {
                            counterFlag++;
                            temporaryFlag = false;
                            break;
                        }


                    }

                }

            }

            if (counterFlag === this.loopsPathsRefined.length) {
                console.log("added new refined loop");
                this.loopsPathsRefined.push(this.loopsPaths[j]);
                this.loopsGainRefined.push(this.loopsGain[j]);
            }

        }

    };


// function to calculate the forward paths
    this.calculateForwardPath = function () {
        // put logic here
        this.DFS();

        let output = document.getElementById("output");

        output.innerHTML = '<hr><p class="titleRes">Forward Paths</p>';

        output.innerHTML += '<p class="numForPaths">num of forward paths =  ' + '<span class="number">' + this.numForwardPaths + '</span>' + '</p>';

        console.log("num of forward paths = " + this.numForwardPaths);

        for (let i = 0; i < this.gains.length; i++) {

            output.innerHTML += '<p class="eachForGain">the Gain of forward path number ' + (i + 1) + ' = ' + '<span class="number">' + this.gains[i] + '</span>' + '</p>';

            let stringTemp = "";
            for (let j = 0; j < this.forwardPaths[i].length; j++) {
                stringTemp += (this.forwardPaths[i])[j];
                if (j != (this.forwardPaths[i]).length - 1) {
                    stringTemp += "  >  ";
                }
            }

            output.innerHTML += '<p class="eachForGain">the path of forward path number ' + (i + 1) + ' :  ' + '<span class="number">' + stringTemp.replace(/>/g, "<i class='right'></i><span></span>") + '</span>' + '</p><br>';

            console.log("Forward path gain " + i + " = " + this.gains[i]);

        }

        output.innerHTML += '<hr>';

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.DFSLoops();

        output.innerHTML += '<hr><br><br><br><p class="titleRes">Loops</p>';

        output.innerHTML += '<p class="numForPaths">num of loops =  ' + '<span class="number">' + this.loopsPathsRefined.length + '</span>' + '</p>';

        console.log("num of loops = " + this.loopsPathsRefined.length);

        for (let i = 0; i < this.loopsGainRefined.length; i++) {

            output.innerHTML += '<p class="eachForGain">the Gain of loop number ' + (i + 1) + ' = ' + '<span class="number">' + this.loopsGainRefined[i] + '</span>' + '</p>';

            console.log("loop gain " + i + " = " + this.loopsGainRefined[i]);

            let tempString = "";
            var tempLoop = [];
            var stringLoops = "";

            console.log((this.loopsPathsRefined[i])[this.loopsPathsRefined[i].length - 1].id);
            //tempString += (this.loopsPathsRefined[i])[this.loopsPathsRefined[i].length - 1].id + "  >  ";
            (this.loopsPathsRefined[i]).unshift((this.loopsPathsRefined[i])[this.loopsPathsRefined[i].length - 1]);
            for (let j = 0; j < this.loopsPathsRefined[i].length; j++) {
                console.log("ID : " + (this.loopsPathsRefined[i])[j].id);
                stringLoops = ((this.loopsPathsRefined[i])[j].id);
                tempLoop.push(stringLoops);
                tempString += (this.loopsPathsRefined[i])[j].id;
                if (j != this.loopsPathsRefined[i].length - 1) {
                    tempString += "  >  ";
                }
            }
            this.pathsOfloops.push(tempLoop);
            console.log("LENGTH OF PATHS OF LOOPS : " + this.pathsOfloops.length);

            output.innerHTML += '<p class="eachForGain">the path of loop number ' + (i + 1) + ' :  ' + '<span class="number">' + tempString.replace(/>/g, "<i class='right'></i><span></span>") + '</span>' + '</p><br>';

        }

        output.innerHTML += '<hr>';

    };


// function to calculate Delta (Untouched)
    this.calculateUntouched = function(){

        for (let u = 0; u < this.pathsOfloops.length; u++){
            this.untouched.push([]);
            this.untouchedGains.push([]);
        }

        for (let l = 0; l < this.pathsOfloops.length; l++) {
            console.log("THIS : " + this.pathsOfloops[l]);
            this.untouched[0].push(this.pathsOfloops[l]);
            this.untouched[1].push(this.pathsOfloops[l]);
        }

        for (let f = 0; f < this.loopsGainRefined.length; f++){
            this.untouchedGains[0].push(this.loopsGainRefined[f]);
            this.untouchedGains[1].push(this.loopsGainRefined[f]);
        }


        var starttFlag = true;
        var i = 1;
        while (true){

            var counter = 0;
            for (let j = 0; j < this.untouched[0].length; j++){
                let firstPath = this.untouched[0][j];
                console.log("FIRST PATH : " + firstPath);
                if (starttFlag){
                    for (let k = j + 1; k < this.untouched[i].length; k++){
                        let secondPath = this.untouched[i][k];
                        console.log("SECOND PATH : " + secondPath);
                        if(this.isIntersected(firstPath, secondPath)){
                            counter++;
                            continue;
                        } else{
                            console.log("UNTOUCHED WITH : " + secondPath);
                            let firstGain = this.untouchedGains[0][j];
                            let secondGain = this.untouchedGains[i][k];
                            var product = this.getLoop(firstPath, secondPath, i);
                            var productGain = (firstGain * secondGain);
                            var next = i + 1;
                            this.untouched[next].push(product);
                            this.untouchedGains[next].push(productGain);
                            console.log("PRODUCT GAIN : " + productGain);
                            console.log("FIRST PATH : " + firstPath);
                            console.log("FIRST GAIN : " + firstGain);
                            console.log("SECOND PATH : " + secondPath);
                            console.log("SECOND GAIN : " + secondGain);
                            console.log("PRODUCT : " + product);
                            console.log("i VALUE : " + i);

                        }
                    }
                } else {
                    for (let k = 0; k < this.untouched[i].length; k++){
                        let secondPath = this.untouched[i][k];
                        console.log("SECOND PATH : " + secondPath);
                        if(this.isIntersected(firstPath, secondPath)){
                            counter++;
                            continue;
                        } else{
                            console.log("UNTOUCHED WITH : " + secondPath);
                            let firstGain = this.untouchedGains[0][j];
                            let secondGain = this.untouchedGains[i][k];
                            var product = this.getLoop(firstPath, secondPath, i);
                            var productGain = firstGain * secondGain;
                            var next = i + 1;
                            this.untouched[next].push(product);
                            this.untouchedGains[next].push(productGain);
                            console.log("FIRST PATH : " + firstPath);
                            console.log("FIRST GAIN : " + firstGain);
                            console.log("SECOND PATH : " + secondPath);
                            console.log("SECOND GAIN : " + secondGain);
                            console.log("PRODUCT : " + product);
                            console.log("PRODUCT GAIN : " + productGain);
                            console.log("i VALUE : " + i);


                        }
                    }
                }

            }
            starttFlag = false;
            console.log("OUT OF FOR LOOP");
            console.log("COUNTER : " + counter);
            if (counter == this.untouched[0].length*this.untouched[i].length){
                this.lengthOfUntouched = i;
                console.log("BREAK : " + i);
                break;
            }
            i++;
        }

        console.log("...........UNTOUCHED GAINS : ");
        for (let r = 0; r < this.untouchedGains.length; r++){
            console.log("ROW : ");
            for (let h = 0; h < this.untouchedGains[r].length; h++){
                console.log("GAIN IS : " + this.untouchedGains[r][h]);
            }
            console.log(" ");
        }

        let newPath = true;
        let addNewPathPlz = true;

        for (let u = 0; u < this.untouched.length; u++) {
            this.untouchedRefined.push([]);
            this.untouchedGainsRefined.push([]);
        }

        // Refining the untouched loops
        for (let i = 0; i < this.untouched.length; i++) {

            if (this.untouched[i][0] != null) {
                this.untouchedRefined[i].push(this.untouched[i][0]);
                this.untouchedGainsRefined[i].push(this.untouchedGains[i][0]);
            }

            console.log("Length of " + i + " untouched not refined: " + this.untouched[i].length);
            console.log("Length of " + i + " untouched refined before: " + this.untouchedRefined[i].length);

            for (let j = 0; j < this.untouched[i].length; j++) {

                let counterFlag = 0;

                let temporaryArray = [];

                for (let z = 0; z < this.untouched[i][j].length; z++) {
                    temporaryArray.push(this.untouched[i][j][z]);
                }
                console.log("temporary before sort: " + temporaryArray);
                temporaryArray.sort();
                console.log("temporary after sort: " + temporaryArray);


                for (let k = 0; k < this.untouchedRefined[i].length; k++) {

                    console.log("");
                    console.log("untouched loop: " + this.untouched[i][j]);
                    console.log("untouched refined loop: " + this.untouchedRefined[i][k]);

                    let temporaryArray2 = [];

                    for (let z = 0; z < this.untouchedRefined[i][k].length; z++) {
                        temporaryArray2.push(this.untouchedRefined[i][k][z]);
                    }
                    console.log("temporary before sort: " + temporaryArray);
                    temporaryArray2.sort();
                    console.log("temporary after sort: " + temporaryArray);

                    if (this.untouched[i][j].length !== this.untouchedRefined[i][k].length) {

                        counterFlag++;
                        continue;

                    }

                    let temporaryFlag = false;
                    for (let l = 0; l < this.untouchedRefined[i][k].length; l++) {

                        if (this.untouched[i][j].length === this.untouchedRefined[i][k].length) {

                            for (let y = 0; y < temporaryArray.length; y++) {
                                if (temporaryArray[y] !== temporaryArray2[y]) {
                                    temporaryFlag = true;
                                    break;
                                }
                            }

                            if (temporaryFlag) {
                                counterFlag++;
                                temporaryFlag = false;
                                break;
                            }


                        }

                    }

                }

                if (counterFlag === this.untouchedRefined[i].length) {
                    console.log("added new refined loop");
                    this.untouchedRefined[i].push(this.untouched[i][j]);
                    this.untouchedGainsRefined[i].push(this.untouchedGains[i][j]);
                }

            }

            console.log("Length of " + i + " untouched refined after: " + this.untouchedRefined[i].length);

        }





        let output = document.getElementById("output");

        output.innerHTML += '<hr><br><br><br><p class="titleRes">Untouched Loops</p>';

        console.log("UNTOUCHED22 : ");

        for(var m = 2; m < this.untouchedRefined.length; m++) {

            output.innerHTML += '<p class="numForPaths">there is ' + '<span class="number">' + this.untouchedRefined[m].length + '</span>' + "<span class='space'></span>" + m + " untouched loops" + '</p>';
            console.log("ROW : ");
            for(var n = 0; n < this.untouchedRefined[m].length; n++) {
                output.innerHTML += '<p class="eachForGain">the Gain of loop number ' + (n + 1) + ' = ' + '<span class="number">' + this.untouchedGainsRefined[m][n] + '</span>' + '</p>';
                console.log("THIS : " + this.untouchedRefined[m][n]);
                let stringTemp = "";
                for (let u = 0; u < (this.untouchedRefined[m][n]).length; u++) {
                    stringTemp += (this.untouchedRefined[m][n])[u];
                    if (u != (this.untouchedRefined[m][n]).length - 1) {
                        stringTemp += "  >  ";
                    }
                }

                output.innerHTML += '<p class="eachForGain">the path of loop number ' + (n + 1) + ' :  ' + '<span class="number">' + stringTemp.replace(/>/g, "<i class='right'></i><span></span>") + '</span>' + '</p><br>';

            }
        }



        output.innerHTML += '<hr>';


    };


// function to calculate the Delta of each path
    this.calculateDeltaIndex = function () {
        // put logic here

        for (let u = 0; u < this.pathsOfloops.length; u++){
            this.untouched.push([]);
            this.untouchedGains.push([]);
            this.untouchedGains.push([]);
        }

        let output = document.getElementById('output');

        output.innerHTML += '<hr><br><br><br><br><p class="titleRes">Delta index</p>';

        for (let i = 0; i < this.forwardPaths.length; i++){
            var forwardPath = this.forwardPaths[i];
            console.log("FORWARD PATH : " + forwardPath);
            this.deltaIndex = [[]];
            this.deltaIndex[0].push(0);
            this.deltaIndex[1] = [];
            this.deltaIndexGain = [[]];
            this.deltaIndexGain[0].push(0);
            this.deltaIndexGain[1] = [];
            for (let k = 1; k <= this.lengthOfUntouched; k++){
                console.log("ROW ...");
                for (let h = 0; h < this.untouched[k].length; h++){
                    var loop = this.untouched[k][h];
                    var loopGain = this.untouchedGains[k][h];
                    console.log("LOOP : " + loop);
                    console.log("LOOP GAIN : " + loopGain);
                    if(this.isIntersected(forwardPath, loop)){
                        continue;
                    } else {
                        console.log("NOT INTERSECTED");
                        this.deltaIndex[k].push(loop);
                        this.deltaIndexGain[k].push(loopGain);
                    }

                }
            }

            console.log("DELTA INDEX : ");

            for(var m = 1; m < this.deltaIndex.length; m++) {

                output.innerHTML += '<p class="numForPaths">Delta ' + '<span class="number">' + (i + 1) + '</span>' + '</p>';

                output.innerHTML += '<p class="eachForGain">there is ' + '<span class="number">' + this.deltaIndex[m].length + '</span>' + "<span class='space'></span>" + m + " untouched loops" + '</p>';

                console.log("ROW : ");
                for(var n = 0; n < this.deltaIndex[m].length; n++) {
                    output.innerHTML += '<p class="eachForGainAgain">the Gain of loop number ' + (n + 1) + ' = ' + '<span class="number">' + this.deltaIndexGain[m][n] + '</span>' + '</p>';
                    console.log("THIS : " + this.deltaIndex[m][n]);
                    let stringTemp = "";
                    for (let u = 0; u < (this.deltaIndex[m][n]).length; u++) {
                        stringTemp += (this.deltaIndex[m][n])[u];
                        if (u != (this.deltaIndex[m][n]).length - 1) {
                            stringTemp += "  >  ";
                        }
                    }

                    output.innerHTML += '<p class="eachForGainAgain">the path of loop number ' + (n + 1) + ' :  ' + '<span class="number">' + stringTemp.replace(/>/g, "<i class='right'></i><span></span>") + '</span>' + '</p><br>';

                }
            }

            let delta = 1;
            let deltaStr = "1";

            for (let i = 1; i < this.deltaIndexGain.length; i++) {

                if (this.deltaIndexGain[i].length === 0) {
                    continue;
                }

                for (let j = 0; j < this.deltaIndexGain[i].length; j++) {
                    if (i % 2 === 0) {
                        delta += this.deltaIndexGain[i][j];
                        if (j === 0) {
                            deltaStr += " + ( ";
                        }
                        deltaStr += this.deltaIndexGain[i][j] + " ";
                    } else {
                        delta -= this.deltaIndexGain[i][j];
                        if (j === 0) {
                            deltaStr += " - ( ";
                        }
                        deltaStr += this.deltaIndexGain[i][j] + " ";
                    }

                    if (j !== this.deltaIndexGain[i].length - 1) {
                        deltaStr += "+ ";
                    }
                }

                deltaStr += ")";

            }

            this.deltaIndexNum.push(delta);
            this.deltaIndexWords.push(deltaStr);

        }
    };
    
    this.getResult = function () {

        // evaluate the delta
        let delta = 1;
        let deltaStr = "1";
        if (this.loopsGainRefined.length !== 0) {
            deltaStr += " - ( ";
        }

        for (let i = 0; i < this.loopsGainRefined.length; i++) {
            delta -= this.loopsGainRefined[i];
            deltaStr += this.loopsGainRefined[i] + " ";
            if (i !== this.loopsGainRefined.length - 1) {
                deltaStr += "+ ";
            }
        }

        deltaStr += ")";

        for (let i = 2; i < this.untouchedGainsRefined.length; i++) {

            if (this.untouchedGainsRefined[i].length === 0) {
                continue;
            }

            for (let j = 0; j < this.untouchedGainsRefined[i].length; j++) {
                if (i % 2 === 0) {
                    delta += this.untouchedGainsRefined[i][j];
                    if (j === 0) {
                        deltaStr += " + ( ";
                    }
                    deltaStr += this.untouchedGainsRefined[i][j] + " ";
                } else {
                    delta -= this.untouchedGainsRefined[i][j];
                    if (j === 0) {
                        deltaStr += " - ( ";
                    }
                    deltaStr += this.untouchedGainsRefined[i][j] + " ";
                }

                if (j !== this.untouchedGainsRefined[i].length - 1) {
                    deltaStr += "+ ";
                }
            }

            deltaStr += ")";
        }

        let output = document.getElementById('output');
        let tempResult = 0;

        output.innerHTML += '<hr><br><br><br><br><p class="titleRes">Result</p>';

        // printing the results
        console.log("");
        console.log("");
        console.log("Result ...........................");
        output.innerHTML += '<p class="equation"><span class="equationLbl">C(s)/R(s) = </span> <span class="sigma">&Sigma;</span> Pi <span class="delta">&Delta;</span>i / <span class="delta">&Delta;</span></p>';
        console.log("");
        console.log("Delta num: " + delta);
        output.innerHTML += '<p class="solution"><span class="solutionLbl">Delta' + ' = </span>' + deltaStr + " = " + delta + '</p><br>';
        console.log("Delta words: " + deltaStr);
        console.log("");


        // evaluate delta index
        for (let i = 0; i < this.deltaIndexNum.length; i++) {
            tempResult += this.deltaIndexNum[i] * this.gains[i];
            console.log("Delta index " + (i + 1) + " num: " + this.deltaIndexNum[i]);
            output.innerHTML += '<p class="solution"><span class="solutionLbl">Delta' + " " + (i + 1) + ' = </span>' + this.deltaIndexWords[i] + " = " + this.deltaIndexNum[i] + '</p>';
            console.log("Delta index " + (i + 1) + " words: " + this.deltaIndexWords[i]);
        }


        // GUI printing
        tempResult /= delta;
        output.innerHTML += '<br><br><p class="equation2"><span class="equationLbl2">C(s)/R(s) = </span>' + tempResult + '</p>';
    };

    /*fillNodes();
    fillEdges();
    calculateForwardPath();
    calculateDelta();
    calculateDeltaIndex();*/
}

