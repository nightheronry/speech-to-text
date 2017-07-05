<?php
header("Access-Control-Allow-Origin: *");
$url="http://stt.itri.org.tw/STTService/v1/stt/useSTT";
$api_key="a9d43ae7061ee72aaa23bc8c0244b578";
$taskName = $_POST["taskName"];
if( isset($_FILES['upload']['tmp_name']) )
{
     $file = $_FILES['upload']['tmp_name'];
     #echo 'php file get'.$file;
}else{
	#echo "file error";
}
if( isset($_POST["taskName"]) )
{
     $taskName = $_POST["taskName"];
     #echo 'php'.$taskName;
}else{
	#echo "taskName error";
}

$content=array();
$buf=base64_encode(file_get_contents($file));

$content['file']=$buf;
$content['taskName']= $taskName;
$content['rate']=16000;
$content['recordStatus']=0;
$error=0;
$res=PostFunction($url,$content,$error,$api_key);
if (!$error){
	echo $res;
}else{
	echo "post error code:".$error;
}

function PostFunction($url,$postData,$errorNo,$api_key){
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, $url);
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $postData);
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array("Authorization: $api_key", "rate: 16000"));
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT_MS, 30000);
	$result = curl_exec($ch);
	$errorNo = curl_errno($ch);
	return $result;
}
?>
