<?php
//$size = $_GET["size"];
//$page = $_GET["page"];
/*
class ArrayValue implements JsonSerializable {
    public function __construct(array $array) {
        $this->array = $array;
    }

    public function jsonSerialize() {
        return $this->array;
    }
}

$array = ['foo' => 'bar', 'quux' => 'baz'];

echo json_encode(new ArrayValue($array), JSON_PRETTY_PRINT);
*/

echo '{
  "page": 1,
  "size": 2,
  "list": [{
      "id": 18,
      "author": {
        "id": 1,
        "name": "Guang",
        "password": null,
        "email": "g10guang@gmail.com",
        "avatarName": "images.jpg",
        "blogNum": 14
      },
      "title": "Bill",
      "uploadDate": "2017-03-22",
      "state": "ON",
      "coverImage": "18.jpg",
      "codeLocation": null,
      "tag": [
        "a",
        "bb",
        "dddd"
      ],
      "introduction": "Kill Bill.",
      "dateString": "2017-03-22"
    },
    {
      "id": 17,
      "author": {
        "id": 1,
        "name": "Guang",
        "password": null,
        "email": "g10guang@gmail.com",
        "avatarName": "images.jpg",
        "blogNum": 14
      },
      "title": "Elon Musk",
      "uploadDate": "2017-03-22",
      "state": "ON",
      "coverImage": "17.jpg",
      "codeLocation": null,
      "tag": [],
      "introduction": "SpaceX",
      "dateString": "2017-03-22"
    }
  ]
}';
?>