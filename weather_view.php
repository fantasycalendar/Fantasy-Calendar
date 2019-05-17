<?php

$title = 'Editing';

include('header.php');

?>
<script>

var test = "100";
var array = [];

var t0 = performance.now();

for(var i = 0; i < 50000000; i++){

	array.push((test|0)+i);

}

var t1 = performance.now();
console.log("Call to |0 took " + (t1 - t0) + " milliseconds.")

var test = "100";
var array = [];

var t0 = performance.now();

for(var i = 0; i < 50000000; i++){

	array.push(parseInt(test)+i);

}

var t1 = performance.now();
console.log("Call to parseInt took " + (t1 - t0) + " milliseconds.")


</script>

<?php
include('footer.php');

?>