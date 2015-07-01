define( [ 'angular' ] , function ( angular ) {
    return angular
        .module( 'application' , [] )

        // 路由表
        .config( [
            '$stateProvider' ,
            function ( $stateProvider ) {

                $stateProvider
                    .state( 'index' , {
                        url : '' ,
                        templateUrl : 'modules/index/index.html'
                    } )
                    .state( 'nav' , {
                        abstract : true ,
                        templateUrl : 'views/nav.html'
                    } )
                    .state( 'nav.about' , {
                        url : '/about' ,
                        templateUrl : 'modules/index/about-me.html'
                    } )
                    //.state( 'blog' , {
                    //    url : '/blog?{page:[1-9]\\d*}' ,
                    //    templateUrl : 'modules/blog/list.html' ,
                    //    controller : 'BlogListController' ,
                    //    params : {
                    //        page : 1
                    //    } ,
                    //    resolve : {
                    //        load : asyncLoad( [ 'modules/blog/module' ] )
                    //    }
                    //} )
                    .state( 'otherwise' , {
                        url : '*path' ,
                        template : '' ,
                        controller : [
                            '$state' ,
                            function ( $state ) {
                                $state.go( 'index' );
                            }
                        ]
                    } );

                /**
                 * 加载依赖的辅助函数
                 * @param deps
                 * @returns {*[]}
                 */
                function asyncLoad( deps ) {
                    return [
                        '$q' , function ( $q ) {
                            var def = $q.defer();
                            require( deps , def.resolve );
                            return def.promise;
                        }
                    ];
                }
            }
        ] )

        // 第一次打开网站时要加载很多文件，所以给一个正在加载的弹层提示用户
        .run( function () {
            var loading = angular.element( document.getElementById( 'loading' ) );
            loading.on( 'transitionend webkitTransitionEnd' , function () {
                loading.remove();
            } );
            loading.addClass( 'app-hide-loading' );
        } )

        // 页面切换的时候显示加载中的状态
        .run( [
            '$rootScope' , /*'$timeout' ,*/ function ( $rootScope /*, $timeout*/ ) {
                $rootScope._loading = false;
                $rootScope.$on( '$stateChangeStart' , function () {
                    $rootScope._loading = true;
                } );
                $rootScope.$on( '$stateChangeSuccess' , function () {
                    //$timeout( function () {
                    $rootScope._loading = false;
                    //} , 2000 );
                } );
            }
        ] );
} );
