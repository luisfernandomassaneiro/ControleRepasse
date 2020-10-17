package br.com.senior.controle.lib.business.application.commom.exceptions;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(Object id){
        super("A Entidade com o ID " + id + " não foi encontrada no banco de dados. Pode ser que ela tenha sido deletada por outro usuário.");
    }
}
