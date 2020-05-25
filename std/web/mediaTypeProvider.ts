// MOST Web Framework Centroid for Deno Copyright (c) 2020, THEMOST LP All rights reserved BSD-3-Clause license
import { Application, ApplicationService } from "../common/app.ts";

const MEDIA_TYPES = [
    {
        "extension": ".css",
        "type": "text/css"
    },
    {
        "extension": ".js",
        "type": "text/js"
    },
    {
        "extension": ".json",
        "type": "application/json"
    },
    {
        "extension": ".xml",
        "type": "text/xml"
    },
    {
        "extension": ".less",
        "type": "text/css"
    },
    {
        "extension": ".png",
        "type": "image/png"
    },
    {
        "extension": ".gif",
        "type": "image/gif"
    },
    {
        "extension": ".bmp",
        "type": "image/bmp"
    },
    {
        "extension": ".jpg",
        "type": "image/jpeg"
    },
    {
        "extension": ".jpeg",
        "type": "image/jpeg"
    },
    {
        "extension": ".htm",
        "type": "text/html"
    },
    {
        "extension": ".html",
        "type": "text/html"
    },
    {
        "extension": ".pdf",
        "type": "application/pdf"
    },
    {
        "extension": ".txt",
        "type": "text/plain"
    },
    {
        "extension": ".svg",
        "type": "image/svg+xml"
    },
    {
        "extension": ".woff",
        "type": "application/x-font-woff"
    },
    {
        "extension": ".ttf",
        "type": "application/octet-stream"
    },
    {
        "extension": ".map",
        "type": "application/json"
    },
    {
        "extension": ".lang",
        "type": "application/json",
        "encoding":"utf-8"
    },
    {
        "extension": ".doc",
        "type": "application/msword"
    },
    {
        "extension": ".dot",
        "type": "application/msword"
    },
    {
        "extension": ".docx",
        "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    {
        "extension": ".xls",
        "type": "application/vnd.ms-excel"
    },
    {
        "extension": ".xlt",
        "type": "application/vnd.ms-excel"
    },
    {
        "extension": ".xla",
        "type": "application/vnd.ms-excel"
    },
    {
        "extension": ".xlsx",
        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    {
        "extension": ".xltx",
        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.template"
    },
    {
        "extension": ".ppt",
        "type": "application/vnd.ms-powerpoint"
    },
    {
        "extension": ".pot",
        "type": "application/vnd.ms-powerpoint"
    },
    {
        "extension": ".pps",
        "type": "application/vnd.ms-powerpoint"
    },
    {
        "extension": ".pptx",
        "type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    },
    {
        "extension": ".potx",
        "type": "application/vnd.openxmlformats-officedocument.presentationml.template"
    },
    {
        "extension": ".ppsx",
        "type": "application/vnd.openxmlformats-officedocument.presentationml.slideshow"
    }
];

export class MediaTypeProvider extends ApplicationService {
    private readonly _mediaTypes: Map<string,string> = new Map();
    constructor(container: Application) {
        super(container);
        MEDIA_TYPES.forEach( mediaType => {
            this._mediaTypes.set(mediaType.extension, mediaType.type);
        });
    }

    append(extension: string, type: string) {
        this._mediaTypes.set(extension, type);
    }

    has(extension: string): boolean {
        return this._mediaTypes.has(extension);
    }

    resolve(extension: string): string | undefined {
        return this._mediaTypes.get(extension);
    }

}