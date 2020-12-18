import { Component } from '@angular/core';
import { MatSnackbarStyle } from 'src/app/enums';
import { QueryService } from 'src/app/services/query.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'refetch',
  templateUrl: './refetch.component.html',
  styleUrls: ['./refetch.component.scss'],
})
export class RefetchComponent {
  constructor(private queryService: QueryService, private snackBarService: SnackbarService) {}

  ngOnInit(): void {}

  refetchData() {
    this.queryService.fetchData();
    this.snackBarService.sendNewMessage('Refetched Data succesful', MatSnackbarStyle.Success);
  }
}
