<?php

$config = array(
  'servers' => array(
    array(
     'name' => 'localhost', // Optional name.
     'host' => '192.168.2.40',
     'port' => 6379,
    ),

  ),


  'seperator' => ':',


  // Uncomment to show less information and make phpRedisAdmin fire less commands to the Redis server. Recommended for a really busy Redis server.
  //'faster' => true,


  // Uncomment to enable HTTP authentication
  'login' => array(
    // Username => Password
    // Multiple combinations can be used
    'root' => '123456789'
  ),




  // You can ignore settings below this point.

  'maxkeylen' => 100
);

?>
