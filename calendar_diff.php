<?php

$title = 'Editing';

include('header.php');

?>


<script>

var interval = 5;
var offset = 0;
offset = (interval-offset+1)%interval;

for(var i = 0; i < 50; i++){

	console.log(i+1, (i + offset) % interval);

}



</script>



<?php
include('footer.php');

?>