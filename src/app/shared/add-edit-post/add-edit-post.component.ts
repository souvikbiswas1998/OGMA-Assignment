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

  public form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(5), Validators.maxLength(80), Validators.required]),
    privacy: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.minLength(100), Validators.maxLength(500), Validators.required]),
  });
  public file: File;
  public id: any;
  // tslint:disable: no-inferrable-types
  public disable: boolean = false;

  public percentageChanges: number = 0;
  url: any;
  public imgUpload = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService, private postService: PostService
  ) {}

  ngOnInit(): void {
    if (this.data?.post) {
      this.form.patchValue({
        title: this.data.post.title,
        privacy: this.data.post.privacy,
        content: this.data.post.content
      });
    }
  }

  public onNoClick(): void {
    if (this.url) { this.postService.deleteStorage(this.url); }
    this.dialogRef.close();
  }

  public submit(): void {
    if (this.form.valid) {
      this.dialogRef.close({...this.form.value, id: this.id ? this.id : null, thumbnail: this.url});
    } else {
      this.form.markAllAsTouched();
      this.appService.openSnackBar('Check the errors.', '');
    }
  }

  // tslint:disable: member-ordering
  private blob: string;
  private isFirstType = true;

  // tslint:disable-next-line: typedef
  public onSelect(files: FileList) {
    if (files && files.length > 0) {
      this.file = files.item(0);
      if (this.file.type !== 'image/jpeg') { this.appService.openSnackBar('Only JPEG images are supported.'); return; }
      if (this.isFirstType && this.url) { this.postService.deleteStorage(this.url); this.url = undefined; }
      this.isFirstType = true;
      this.readFileAsURL(files.item(0))
      .then(blob => {
          this.disable = true;
          this.imgUpload = true;
          this.blob = blob;
          this.upload();
        })
        .catch(error => this.appService.openSnackBar('Error opening file: ' + error.message, ''));
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
    // this.id = x.id;
    x.percentageChanges.then(snapshot => {
      snapshot.ref.getDownloadURL().then(
        url => {
          this.url = url;
          this.disable = false;
        }
      );
    });
    x.percentageChanges.percentageChanges().subscribe((data: any) => this.percentageChanges = data);
  }
}
