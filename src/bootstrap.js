require.config( {
    baseUrl : './' ,
    waitSeconds : 0 ,
    paths : {
        angular : 'vendor/angular/angular'
    } ,
    shim : {
        angular : {
            exports : 'angular' ,
            init : function () {
                // ---------------------重要代码段！------------------------------
                // 应用启动后不能直接用 module.controller 等方法，否则会报控制器未定义的错误，
                // 见 http://stackoverflow.com/questions/20909525/load-controller-dynamically-based-on-route-group
                var _module = angular.module;
                angular.module = function () {
                    var newModule = _module.apply( angular , arguments );
                    if ( arguments.length >= 2 ) {
                        newModule.config( [
                            '$controllerProvider' ,
                            '$compileProvider' ,
                            '$filterProvider' ,
                            '$provide' ,
                            function ( $controllerProvider , $compileProvider , $filterProvider , $provide ) {
                                newModule.controller = function () {
                                    $controllerProvider.register.apply( this , arguments );
                                    return this;
                                };
                                newModule.directive = function () {
                                    $compileProvider.directive.apply( this , arguments );
                                    return this;
                                };
                                newModule.filter = function () {
                                    $filterProvider.register.apply( this , arguments );
                                    return this;
                                };
                                newModule.factory = function () {
                                    $provide.factory.apply( this , arguments );
                                    return this;
                                };
                                newModule.service = function () {
                                    $provide.service.apply( this , arguments );
                                    return this;
                                };
                                newModule.provider = function () {
                                    $provide.provider.apply( this , arguments );
                                    return this;
                                };
                                newModule.value = function () {
                                    $provide.value.apply( this , arguments );
                                    return this;
                                };
                                newModule.constant = function () {
                                    $provide.constant.apply( this , arguments );
                                    return this;
                                };
                                newModule.decorator = function () {
                                    $provide.decorator.apply( this , arguments );
                                    return this;
                                };

                                //newModule.config = newModule.run = function () {
                                //    angular.element( document ).injector().invoke.apply( this , arguments );
                                //};
                            }
                        ] );
                    }
                    return newModule;
                };
            }
        } ,
        'vendor/angular/angular-ui-router' : [ 'angular' ] ,
        'vendor/angular/angular-animate' : [ 'angular' ] ,
        '../test/e2e/angular-mocks' : [ 'angular' ] ,
        'vendor/angular/angular-sanitize' : [ 'angular' ] ,
        'vendor/angular/angular-touch' : [ 'angular' ] ,
        'vendor/angular/ui-bootstrap-tpls' : [ 'angular' ]
    } ,
    map : {
        '*' : {
            css : 'vendor/require/css'
        }
    }
} );

require( [
    'angular' ,
    'vendor/angular/angular-ui-router' ,
    'vendor/angular/angular-touch' ,
    'vendor/angular/ui-bootstrap-tpls' ,
    'vendor/angular/angular-animate' ,
    'vendor/angular/angular-sanitize' ,

    // uncomment this line when we need e2e test
    //'../test/e2e/angular-mocks' ,
    './app' //, // prefix `./` must have, otherwise the `gulp-rev-all` don't update referrcn

    // 公用的服务和指令列在下面
] , function ( angular ) {
    angular.module( 'all' , [
        'ui.router' , 'ui.bootstrap' , 'ngSanitize' , 'ngTouch' , 'ngAnimate' , 'application'
    ] );
    angular.module( 'boot' , [ 'all' ] );
    angular.bootstrap( document , [ 'boot' ] , {
        strictDi : true
    } );
} );

