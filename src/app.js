define( [ 'angular' ] , function ( angular ) {
    return angular
        .module( 'application' , [] )
        .config( [
            '$stateProvider' ,
            function ( $stateProvider ) {

                $stateProvider
                    .state( 'nav' , {
                        templateUrl : 'views/nav.html'
                    } )
                    .state( 'index' , {
                        url : '/' ,
                        templateUrl : 'modules/index/index.html'
                    } )
                    .state( 'about' , {
                        url : '/about' ,
                        templateUrl : 'modules/index/about-me.html'
                    } )
                    .state( 'blog' , {
                        url : '/blog?{page:[1-9]\\d*}' ,
                        templateUrl : 'modules/blog/list.html' ,
                        controller : 'BlogListController' ,
                        params : {
                            page : 1
                        } ,
                        resolve : {
                            load : asyncLoad( [ 'modules/blog/module' ] )
                        }
                    } )
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
        .run( function () {
            var loading = angular.element( document.getElementById( 'loading' ) );
            loading.on( 'transitionend webkitTransitionEnd' , function () {
                loading.remove();
            } );
            loading.addClass( 'app-hide-loading' );
        } );
} );
