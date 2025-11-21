import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';

@Component({
  selector: 'app-new-task',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormField,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss',
})
export class NewTaskComponent {
  private readonly trpc = inject(TRPC_CLIENT);
  private readonly dialogRef = inject(MatDialogRef<NewTaskComponent>);

  protected readonly newTitle = signal('');
  protected readonly newDescription = signal('');

  protected readonly createTask = trpcResource(
    this.trpc.tasks.createTask.mutate,
    () => ({
      title: this.newTitle(),
      description: this.newDescription(),
    })
  );

  protected async save() {
    if (await this.createTask.refresh()) {
      this.dialogRef.close(true);
    }
  }

  protected cancel() {
    this.dialogRef.close(false);
  }
}
