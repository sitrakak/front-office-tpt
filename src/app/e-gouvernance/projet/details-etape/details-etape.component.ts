import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { CommentaireService } from 'src/app/shared/commentaire.service';
import { MembreService } from 'src/app/shared/membre.service';
import { ProjetService } from 'src/app/shared/projet.service';


@Component({
  selector: 'app-details-etape',
  templateUrl: './details-etape.component.html',
  styleUrls: ['./details-etape.component.css']
})


export class DetailsEtapeComponent implements OnInit{
  id!:string;
  nom: string = '';
  description: string = '';
  dateDebut: string = '';
  datePrevu: string = '';
  remarque: string = '';
  image:string='';
  showForm: boolean = false;
  etape: any;
  commentaire: any;
  comment: any= '';

  public constructor(private router:Router, private route:ActivatedRoute, private projetService:ProjetService, private commentaireService:CommentaireService, private authService: AuthService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getEtape();
    this.getCommentaire();
  }

  getEtape() {
    this.projetService.getEtapeById(this.id).subscribe((data) => {
      this.etape = data;
    });
  }

  toggleForm(): void {
      this.showForm = !this.showForm;
  }

  getCommentaire() {
    this.commentaireService.getCommentaire(this.id, 'INFO')
    .subscribe((resp: any) => {
      this.commentaire = resp.data;

      for (const comment of this.commentaire) {
        this.authService.getUserById(comment.id_user)
          .subscribe((user: any) => {
            comment.user = user.nom;
          });
      }
    },
    (error) => {
      console.error('Une erreur est survenue : ', error);
    });
  }

  commenter(){
    const idUser = localStorage.getItem("idUser");
    console.log(idUser);
    
    if (this.comment) {
      const commentaire = {
        type_mere: 'ETAPE',
        id_mere: this.id,
        id_user: idUser,
        contenu: this.comment
      }
      console.log(commentaire);
      
      this.commentaireService.addCommentaire(commentaire)
      .subscribe(data => {
        console.log(data);
      },
      (error) => {
        console.error('Une erreur est survenue : ', error);
      });
    }
    else{
      console.log('Veuillez ajouter un commentaire');
    }
  }

}