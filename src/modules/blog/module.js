define( [
    '../../app' ,
    '../../vendor/marked'
] , function ( app , marked ) {
    app
        .filter( 'md' , function () {
            var renderer = new marked.Renderer() ,
                _image   = renderer.image;
            renderer.image = function ( href , title , text ) {
                return '<br><a href="' + href + '" target="_blank">' + _image.apply( this , arguments ) + '</a><br>';
            };
            return function ( input ) {
                return marked( input , {
                    renderer : renderer
                } );
            };
        } )
        .factory( 'BlogFactory' , [
            '$http' , function ( $http ) {
                var factory = {

                    /**
                     * Get blog list by use Github API.
                     * @see https://developer.github.com/v3/issues/#list-issues-for-a-repository
                     * @param {=} config
                     * @param {number=} config.page Default is 1
                     * @param {number=} config.per_page Default is 10
                     * @param {string=} config.state Default is 'all'
                     * @param {string=} config.labels Default is '非技术'
                     * @returns {*}
                     */
                    query : function ( config ) {
                        if ( !config ) {
                            config = { page : 1 , per_page : 10 };
                        } else {
                            if ( !config.page ) {
                                config.page = 1;
                            }
                            if ( !config.per_page ) {
                                config.per_page = 10;
                            }
                        }
                        config.state = 'all';
                        config.labels = '非技术';
                        return $http( {
                            url : 'https://api.github.com/repos/lmk123/blog/issues' ,
                            method : 'get' ,
                            params : config ,
                            cache : true
                        } ).then( function ( response ) {
                            return response.data;
                        } );
                    }
                };
                return factory;
            }
        ] )
        .controller( 'BlogListController' , [
            '$scope' , 'BlogFactory' , '$stateParams' ,
            function ( $scope , BlogFactory , $stateParams ) {
                $scope.ps = {
                    loading : true
                };
                BlogFactory.query( {
                    page : $stateParams.page
                } ).then( function ( articlesList ) {
                    $scope.articles = articlesList;
                } );
            }
        ] );
} );
