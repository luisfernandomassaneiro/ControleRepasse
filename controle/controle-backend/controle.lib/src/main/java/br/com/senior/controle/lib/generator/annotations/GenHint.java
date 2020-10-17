package br.com.senior.controle.lib.generator.annotations;

import br.com.senior.controle.lib.generator.Type;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target(FIELD)
@Retention(RUNTIME)
public @interface GenHint {

    /**
     * Informa se o atributo deve ser usado como label.
     * O Campo de Label é usado para exibições da Entidade, como em COmbos ou colunas na Grid.
     * EX: Se o atributo 'nome' da entidade for marcada como label, o nome será exibido nas combos
     * e Grids.
     */
    boolean label() default false;

    /**
     * Informa se o atributo deve ser ignorado pelo Gerador. Por padrão, todos os campos da entidade
     * são incluídos na tela de inclusão, alteração e visualização. Caso um campo
     * não deve ser exibido nestes lugares, deve ser marcado como ignorado.
     */
    boolean ignore() default false;

    /**
     * Informa se o atributo deve ser exibido na tabela de listagem e como filtro. Caso seja false, o
     * campo será exibido normalmente nas telas de visualização, edição ou inclusão, mas não será
     * exibido na tabela de listagem dos registros.
     */
    boolean listing() default false;

    /**
     * Tipos especiais pré configurados do Atributo. Se algum tipo diferente de NONE for informado, o sistema automaticamente irá tratar as validações e
     * máscaras para aplicadas tanto no backend como no FrontEnd
     */
    Type type() default Type.NONE;
}
