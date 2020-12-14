import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  

    // path: 'notifications',
    // loadChildren: () => import('src/app/shared/notifications/notifications.component')
    { path: '**', loadChildren: './user/user.module#UserModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
