import { Component, inject, signal, viewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskCardComponent } from './task-card/task-card.component';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from './new-task/new-task.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tasks',
  imports: [
    MatPaginator,
    MatProgressSpinnerModule,
    TaskCardComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
})
export class TasksPage {
  private readonly trpc = inject(TRPC_CLIENT);
  private readonly dialog = inject(MatDialog);

  protected readonly paginator = viewChild.required(MatPaginator);
  protected async taskDeleted() {
    await this.taskResource.refresh();
    if (
      this.pageOffset() != 0 &&
      this.taskResource.value()?.data.length === 0
    ) {
      this.paginator().previousPage();
    }
  }

  protected readonly PAGE_SIZE = 12 as const;
  private readonly pageOffset = signal(0);

  protected readonly taskResource = trpcResource(
    this.trpc.tasks.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  );

  protected handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }

  protected openCreateDialog() {
    this.dialog
      .open(NewTaskComponent)
      .afterClosed()
      .subscribe(isSaved => {
        if (isSaved) {
          this.taskResource.refresh();
        }
      });
  }
}
