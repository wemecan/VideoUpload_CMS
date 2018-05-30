/**
 * Created by liqiaoqiao on 2018/5/30.
 */
'use strict';

var app = angular.module('themesApp');
app.controller('ctrl-more-pictures', ['$scope','$rootScope','$timeout', 'dialogs','$modal',function ($scope,$rootScope,$timeout, dialogs,$modal) {
    $scope.mainTitle = $rootScope.mainTitle || '相册';
    $scope.isInfo = $rootScope.isInfo;
    $scope.infoFile = 'views/images.html';
    $scope.images = $rootScope.images;
    $scope.showImages = function (images) {
        $scope.isInfo = true;
        $scope.images = images.img;
        $scope.mainTitle = images.text;
    };
    $scope.showImg = function (src) {
        $modal.open({
            templateUrl: 'imageModalContent.html',
            controller:  ['$scope', '$modalInstance','images', function ($scope, $modalInstance,images) {
                $scope.src = 'assets/demo/images/'+ src;
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.preShow = function () {
                    var index = images.findIndex(function (item) {
                        return item === $scope.src.slice(19,)
                    });
                    index > 0 ? $scope.src = 'assets/demo/images/'+images[index-1] : '';
                };
                $scope.nextShow = function () {
                    var index = images.findIndex(function (item) {
                        return item === $scope.src.slice(19,)
                    });
                    index < images.length-1 ? $scope.src = 'assets/demo/images/'+images[index+1] : '';
                };
            }],
            size:        'lg',
            resolve: {
                images: function () {
                    return $scope.images;
                }
            }
        });
    };
    $scope.cancel = function () {
        $scope.isInfo = false;
        $scope.mainTitle = '相册';
    };
    //上传图片
    $scope.upload = function () {
        new BUpload({
            src:'imgFile',
            upload_url : "php/default/upload_json.php",
            list_url : null,	//图片列表数据获取url
            search_url : null,	//图片搜索页面url
            grap_url : null, //搜索网络图片的抓取url
            max_filesize : 1024,
            max_filenum : 10,
            callback : function(data) {
                console.log(data);
                //重新获取相册列表

            }
        });
    };
    //创建新相册
    $scope.createPictures = function () {
        $modal.open({
            templateUrl: 'newPictures.html',
            controller: function ($scope,$modalInstance,pictures,upload) {
                var picturesName = '';
                $scope.isCreate = true;
                $scope.ok = function (status) {
                    picturesName = $('#picturesName').val();
                    if (status === '1') {
                        upload();
                        $modalInstance.dismiss('cancel');
                        return;
                    }
                    if (picturesName === '') return;
                    pictures.push({
                        img: [],
                        text: picturesName
                    });
                    $scope.isCreate = false;
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                }
            },
            size: 'md',
            resolve : {
                pictures: function () {
                    return $rootScope.pictures;
                },
                upload: function () {
                    return $scope.upload;
                }
            }
        })
    };
    //删除相册
    $scope.removePictures = function ($index) {
        dialogs.openDialog('删除相册','确定删除该相册？','确定','取消',function () {
            $timeout(function () {
                $rootScope.pictures.splice($index,1);
                //重新获取相册
            })
        },'')
    }

}]);