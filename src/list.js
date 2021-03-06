module.exports = (__app, __sourcePath) => {

    __app.get('/list/', function (req, res) {
        const files = [];

        const pageSize = req.query.size;
        const currentPage = parseInt(req.query.page);
        const HOSTNAME = req.protocol + '://' + req.hostname + ':' + __app.get('port');
        fs.readdirSync(ROOT).forEach(file => {
            if (!fs.statSync(__sourcePath + file).isDirectory()) {
                files.push(file);
            }
        });
        const pageCount = Math.ceil(files.length / pageSize);
        const indexStart = currentPage * (pageSize);
        const indexEnd = (currentPage + 1) * (pageSize);
        const imageList = files.slice(indexStart, indexEnd);
        const responseList = {
            "content": [],
            "last": (currentPage + 1 === pageCount),
            "total_pages": pageCount,
            "total_elements": files.length,
            "first": (currentPage === 0),
            "number_of_elements": imageList.length,
            "size": imageList.length,
            "number": 0

        }
        let index = 0;
        imageList.map((file) => {
            index++;
            console.log(CONFIG.source_directory + file);
            const buffer = readChunk.sync(CONFIG.source_directory + file, 0, 4100);
            if (fileType(buffer).mime.startsWith('image')) {
                const currentImage = {
                    "id": 1,
                    "ref_id": "",
                    "path": "",
                    "thumbnail_paths": {},
                    "preview_image_paths": {},
                    "name": "",
                    "type": "IMAGE",
                    "order": "1",
                    "is_default": false
                };
                currentImage.id = index;
                currentImage.name = file;
                currentImage.path = HOSTNAME + '/uploads/' + file;
                const thumbnail_paths = {};
                resolutions.map((mapResponse) => {
                    thumbnail_paths[mapResponse.key] = HOSTNAME + '/uploads/' + mapResponse.key + '/' + file;

                });
                currentImage.thumbnail_paths = thumbnail_paths;
                responseList.content.push(currentImage);
            } else if (fileType(buffer).mime.startsWith('video')) {
                const currentImage = {
                    "id": 1,
                    "ref_id": "",
                    "path": "",
                    "thumbnail_paths": {},
                    "preview_image_paths": {},
                    "name": "",
                    "type": "IMAGE",
                    "order": "1",
                    "is_default": false
                };
                currentImage.id = index;
                currentImage.type = 'VIDEO';
                currentImage.name = file;
                currentImage.path = HOSTNAME + '/uploads/' + file;
                currentImage.preview_image_paths = [HOSTNAME + '/uploads/video/' + file + '/tn_1.png'];
                responseList.content.push(currentImage);
            }
        })
        res.send(responseList);
    });
}

