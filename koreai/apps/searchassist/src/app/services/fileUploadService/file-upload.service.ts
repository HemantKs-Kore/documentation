import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({providedIn: 'root'})

export class FileUploadService {
    onFileUpload(fileObject, supportingFileFormats) {
        return Observable.create(observer => {
          let _ext = "";
          if (fileObject.name) {
              _ext = fileObject.name.substring(fileObject.name.lastIndexOf('.'));
              if (supportingFileFormats.indexOf(_ext) === -1) {
                observer.error(new Error('Please upload '+ supportingFileFormats.join(', ').toUpperCase() +' files'));
              }
          }
          const reader = new FileReader();
          reader.readAsText(fileObject);
          reader.onload = function (e) {
              const respnoseData = <any>reader.result;
              if(!respnoseData || respnoseData && !respnoseData.length){
                observer.error(new Error('Upload a valid file!'));
              }else{
                const data = new FormData();
                data.append('file', fileObject);
                data.append('fileContext', 'bulkImport');
                data.append('fileExtension', _ext.substring(_ext.lastIndexOf('.') + 1));
                data.append('Content-Type', fileObject.type);
                observer.next(data);
              }
          };
        });
    }
}