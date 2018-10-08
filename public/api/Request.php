<?php
class Request {
    var $req = [
        "GET" => [],
        "POST" => [],
        "PUT" => [],
        "DELETE" => []
    ];

    function setRequest ($type, $route, $callback) {
        $this->req[$type][$route] = $callback;
    }

    function get ($route, $callback) {
        $this->setRequest('GET', $route, $callback);
    }

    function post ($route, $callback) {
        $this->setRequest('POST', $route, $callback);
    }

    function put ($route, $callback) {
        $this->setRequest('PUT', $route, $callback);
    }

    function delete ($route, $callback) {
        $this->setRequest('DELETE', $route, $callback);
    }

    function result ($S) {
        $method = strtoupper($S["REQUEST_METHOD"]);
        $pathinfo = '/'.@$_GET['url'];
        if (array_key_exists($method, $this->req) && array_key_exists($pathinfo, $func = $this->req[$method]))
        return $func[$pathinfo]($this);
        return [
            "error" => false,
            "message" => "Unhandled request method",
            "detail" => [$this->req[$method], $method, $S, $pathinfo]  
        ];
    }

    function ret ($error, $message, $details = []) {
        $ret = [
            "error" => $error,
            "message" => $message
        ];

        if (count($details)) {
            $ret["details"] = $details;
        }
        return $ret;
    }

    function error ($message, $details = []) {
        return $this->ret(true, $message, $details);
    }

    function success ($message, $details = []) {
        return $this->ret(false, $message, $details);
    }
}