import { Component } from '@angular/core';
import { MatSnackbarStyle } from 'src/app/enums';
import { ContentService } from 'src/app/services/content.service';
import { QueryService } from 'src/app/services/query.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'refetch',
  templateUrl: './refetch.component.html',
  styleUrls: ['./refetch.component.scss'],
})
export class RefetchComponent {
  constructor(private snackBarService: SnackbarService, private contentService: ContentService) {}

  ngOnInit(): void {}

  refetchData() {
    this.contentService.refetch.next();
    this.snackBarService.sendNewMessage('Refetched Data succesful', MatSnackbarStyle.Success);
  }
}
