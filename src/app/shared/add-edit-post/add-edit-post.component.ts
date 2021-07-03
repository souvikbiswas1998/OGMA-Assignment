import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.scss']
})
export class AddEditPostComponent implements OnInit {

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(3), Validators.maxLength(50), Validators.required]),
    privacy: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.minLength(3), Validators.required]),
  });
  file: any;
  id: any;
  // tslint:disable: no-inferrable-types
  disable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService, private postService: PostService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    if (this.form.valid) {
      this.dialogRef.close({...this.form.value, id: this.id ? this.id : null});
    } else {
      this.appService.openSnackBar('Check the errors.', '');
    }
  }

  // tslint:disable: member-ordering
  // tslint:disable: no-inferrable-types
  photoLoader: boolean = false;
  blob: string;
  url: string;

  // tslint:disable-next-line: typedef
  public onSelect(files: FileList) {
    this.disable = true;
    if (files && files.length > 0) {
      this.photoLoader = true;
      this.file = files.item(0);
      this.readFileAsURL(files.item(0))
        .then(blob => {
          this.blob = blob;
          this.upload();
        })
        .catch(error => this.appService.openSnackBar('Error opening file: ' + error.message, ''))
        .finally(() => this.photoLoader = false);
    }
  }

  private async readFileAsURL(file: File | Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => resolve(event.target.result as any);
      reader.onerror = error => reject(error);
    });
  }

  // tslint:disable-next-line: typedef
  public upload() {
    if (this.file.size > 10 * 1024 * 1024) {
      this.appService.openSnackBar('Max limit is 10 mb', '');
      return;
    }
    const x = this.postService.uploadThumbnail(this.blob);
    this.id = x.id;
    this.disable = false;
    x.percentageChanges.percentageChanges().subscribe((data: any) => {
      console.log(data);
    });
  }
}
